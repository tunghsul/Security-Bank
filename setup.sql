-- CREATE TABLE IF NOT EXISTS `books_reviews` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `book_name` varchar(50) NOT NULL,
--   `book_review` varchar(50) NOT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

CREATE TABLE if not exists users (
    `id` serial PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `password` varchar(100) NOT NULL,
    `balance` int default 0
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;