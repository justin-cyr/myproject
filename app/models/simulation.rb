
class Simulation < ApplicationRecord

    validates :session_token, :security_set, presence: true
    validates :start_time, :end_time, presence: true, numericality: { only_integer: true , greater_than: 0 }
    validates :initial_cash, presence: true, numericality: { greater_than: 0 }
    validates :transaction_cost, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :exec_delay_sec, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

    # public class methods

    def self.find_by_simulation_id(simulation_id)
        simulation = Simulation.find_by(id: simulation_id)
    end

end
