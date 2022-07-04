class CreateTicks < ActiveRecord::Migration[5.2]
  def change
    create_table :ticks do |t|
      t.string :simulation_id
      t.integer :timestamp
      t.string :quote_set

      t.timestamps
    end
  end
end
