import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },

    description: {
        type: DataTypes.STRING(500),
        defaultValue: ""
    },

    category: {
        type: DataTypes.ENUM('appetizer', 'soup', 'salad', 'main', 'dessert', 'beverage', 'wine', 'side'),
        allowNull: false
    },

    cuisine: {
        type: DataTypes.ENUM('vietnamese', 'asian', 'european', 'fusion', 'vegetarian', 'vegan'),
        defaultValue: 'vietnamese'
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: null
    },

    calories: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },

    protein: {
        type: DataTypes.DECIMAL(8, 2),
        defaultValue: null
    },

    fat: {
        type: DataTypes.DECIMAL(8, 2),
        defaultValue: null
    },

    carbs: {
        type: DataTypes.DECIMAL(8, 2),
        defaultValue: null
    },

    allergens: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    isVegetarian: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    isVegan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    isGluten: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    image: {
        type: DataTypes.STRING(500),
        defaultValue: null
    },

    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    availableFrom: {
        type: DataTypes.STRING(20),
        defaultValue: null
    },

    availableUntil: {
        type: DataTypes.STRING(20),
        defaultValue: null
    },

    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },

    lowStockThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },

    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },

    ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    orderCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    preparationTime: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
        validate: {
            min: 5
        }
    },

    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'easy'
    },

    spiceLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },

    portions: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    status: {
        type: DataTypes.ENUM('active', 'inactive', 'archived'),
        defaultValue: 'active'
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Foods',
    timestamps: true,
    indexes: [
        {
            fields: ['name']
        },
        {
            fields: ['category']
        },
        {
            fields: ['isAvailable']
        },
        {
            fields: ['cuisine']
        },
        {
            fields: ['status']
        },
        {
            fields: ['price']
        }
    ]
});

export default Food;