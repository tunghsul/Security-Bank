CREATE TABLE IF NOT EXISTS `users` (
    `id` serial PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `password` varchar(100) NOT NULL,
    `balance` int DEFAULT 0
)
