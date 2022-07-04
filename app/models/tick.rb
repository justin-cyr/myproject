class Tick < ApplicationRecord
@@quote_sep = '_'

validates :simulation_id, :timestamp, :quote_set, presence: true

# public class methods

def self.new_from_quote_array(simulation_id, timestamp, quote_array)
    quote_set = (quote_array.map { |quote| quote.to_s}).join(@@quote_sep)
    Tick.new({simulation_id: simulation_id, timestamp: timestamp, quote_set: quote_set})
end


def self.find_by_timestamp(simulation_id, timestamp)
    Tick.find_by(simulation_id: simulation_id, timestamp: timestamp)
end


def self.delete_by_timestamp(simulation_id, timestamp)
    tick = Tick.find_by_timestamp(simulation_id, timestamp)
    tick.delete
end


def self.save_tick_data(simulation_id, tick_data)
    start_time = tick_data.start_time
    end_time = tick_data.end_time

    (start_time..end_time).each do |timestamp|
        tick = Tick.new_from_quote_array(simulation_id, timestamp, tick_data.tick_data[timestamp])
        tick.save
    end

end


def self.delete_tick_data(simulation_id, start_time, end_time)
    (start_time..end_time + 60).each do |timestamp|
        Tick.delete_by_timestamp(simulation_id, timestamp)
    end
end


# public instance methods

def map_tickers_to_quotes(ticker_array)
    quotes = self.quote_set.split(@@quote_sep).map { |quote_str| quote_str.to_f }
    quote_dict = Hash.new()
    (0...ticker_array.length).each do |i|
        quote_dict[ticker_array[i]] = quotes[i] > 0 ? quotes[i] : nil
    end
    quote_dict
end

end
