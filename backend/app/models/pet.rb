class Pet < ApplicationRecord
    belongs_to :agency
    belongs_to :user
end
