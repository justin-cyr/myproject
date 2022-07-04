require 'finnhub_ruby'
require 'distribution'

class TickData
    @@finnhub_api_key = Rails.application.credentials.finnhub_api_key
    @@missing_data_placeholder = 'x'

    attr_reader :tickers, :start_time, :end_time, :tick_data


    # TickData constructor
    def initialize(tickers, start_time, end_time)

        # set API key
        FinnhubRuby.configure do |config|
            config.api_key['api_key'] = @@finnhub_api_key
        end
        @@finnhub_client = FinnhubRuby::DefaultApi.new

        # get data from API
        raw_tick_data = TickData.get_multiple_stock_candles(tickers, start_time, end_time)

        @tickers = raw_tick_data.keys

        i_start = 0
        while raw_tick_data[@tickers[i_start]]['status'] == 'no_data'
            i_start += 1
        end

        if (@tickers.length == 0) || (i_start == @tickers.length)
            raise StandardError.new 'No data returned by API for tickers ' + tickers.join(', ') + 
                ' between ' + start_time.to_s + ' and ' + end_time.to_s + '.' 
        end

        min_start_time  = raw_tick_data[@tickers[i_start]]['start_time']
        max_end_time    = raw_tick_data[@tickers[i_start]]['end_time']

        @tickers.each do |ticker|
            if raw_tick_data[ticker]['status'] == 'ok'
                min_start_time  = [raw_tick_data[ticker]['start_time'], min_start_time].min
                max_end_time    = [raw_tick_data[ticker]['end_time'], max_end_time].max
            end
        end

        @start_time = min_start_time
        @end_time = max_end_time + 60

        # format as array of ticks
        tick_data = Hash.new()
        @tickers.each do |ticker|
            tick_data = generate_ticks(tick_data, raw_tick_data[ticker], @start_time, @end_time, ticker)
        end
        @tick_data = tick_data
    end


    # public class methods

    def self.get_stock_candles(ticker, start_time, end_time)

        res = @@finnhub_client.stock_candles(ticker, '1', start_time, end_time).to_hash

        if res[:s] == 'no_data'
            # handle no data
            data = Hash.new()
            data['status'] = 'no_data'
            data
        else
            data = Hash.new()
            data['status'] = 'ok'
            data['start_time'] = res[:t][0]
            data['end_time'] = res[:t][-1]

            (0...res[:t].length).each do |i|
                data[res[:t][i]] = {o: res[:o][i],
                                    h: res[:h][i],
                                    l: res[:l][i],
                                    c: res[:c][i]
                                }
            end
            data
        end
    end


    def self.get_multiple_stock_candles(tickers, start_time, end_time)
        res = Hash.new()
        tickers.each do |ticker|
            begin
                res[ticker] = get_stock_candles(ticker, start_time, end_time)
            rescue StandardError => e
                puts(e.message)
            end
        end
        res
    end


    # public instance methods

    def generate_ticks(generated_ticks, raw_tick_data, start_time, end_time, ticker)
        # get number of ticks
        one_over_60 = 1 / 60.0
        num_minutes = (end_time - start_time) / 60

        minute_start = start_time
        last_quote = raw_tick_data['status'] == 'ok' ? raw_tick_data[raw_tick_data['start_time']][:o] : @@missing_data_placeholder

        (0...num_minutes).each do |i|
            generate = false

            if (raw_tick_data['status'] == 'ok') && (raw_tick_data[minute_start])
                # generate ticks for this name and add to quotes array
                generate = true

                open_i  = raw_tick_data[minute_start][:o]
                high_i  = raw_tick_data[minute_start][:h]
                low_i   = raw_tick_data[minute_start][:l]
                close_i = raw_tick_data[minute_start][:c]

                # use a uniquely seeded random number generator for each ticker and minute
                # to ensure that samples are deterministic
                # encode the ticker as an integer and append it to the minute
                seed = 0
                ticker.bytes.each_with_index { |x, i| seed += x * 100**i }
                seed += (minute_start / 10) * 100**(ticker.length)
                normal_generator = Distribution::Normal.rng(0, 1, seed)
                z = 60.times.map { normal_generator.call }
                sum_zn = z.inject { |x, s| s += x }
                running_sum_zn = 0

                # standard deviation in this minute
                sigma = high_i - low_i
                sigma_over_60 = sigma * one_over_60
                mean_correction = sigma_over_60 * one_over_60 * sum_zn
            end

            # generate next minute
            (0...60).each do |n|
                timestamp = minute_start + n

                if generate
                    
                    quote = sigma_over_60 * running_sum_zn - 
                        n * mean_correction + 
                        n * one_over_60 * close_i + 
                        (60 - n) * one_over_60 * open_i

                    running_sum_zn += z[n]

                    quote = [low_i, [high_i, quote].min].max
                    last_quote = quote
                else
                    quote = last_quote
                end
                
                if generated_ticks[timestamp] && generated_ticks[timestamp].kind_of?(Array)
                    generated_ticks[timestamp].append(quote)
                else
                    generated_ticks[timestamp] = [quote]
                end
            end

            # move ahead 1 minute
            minute_start += 60
        end
        
        # append last close
        timestamp = end_time
        quote = raw_tick_data['status'] == 'ok' ? raw_tick_data[raw_tick_data['end_time']][:c] : @@missing_data_placeholder

        if generated_ticks[timestamp] && generated_ticks[timestamp].kind_of?(Array)
            generated_ticks[timestamp].append(quote)
        else
            generated_ticks[timestamp] = [quote]
        end

        generated_ticks
    end

end
