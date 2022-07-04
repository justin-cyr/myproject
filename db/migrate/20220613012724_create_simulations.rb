class CreateSimulations < ActiveRecord::Migration[5.2]
  def change
    create_table :simulations do |t|
      t.string :session_token
      t.integer :start_time
      t.integer :end_time
      t.decimal :initial_cash
      t.decimal :transaction_cost
      t.integer :exec_delay_sec
      t.string :security_set

      t.timestamps
    end
  end
end
