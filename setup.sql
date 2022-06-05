CREATE TABLE IF NOT EXISTS `users` (
    `id` serial PRIMARY KEY,
    `name` varchar(127) NOT NULL UNIQUE,
    `password` varchar(127) NOT NULL,
    `balance` DECIMAL(12,2) DEFAULT 0 CHECK (`balance` >= 0),
    `iv` varchar(255) NOT NULL
)
