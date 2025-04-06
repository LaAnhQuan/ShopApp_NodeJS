-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Apr 06, 2025 at 02:43 PM
-- Server version: 5.7.40
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopapp_online`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `banner_details`
--

CREATE TABLE `banner_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `banner_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Samsung', NULL, '2025-04-05 11:49:28', '2025-04-05 11:49:28'),
(3, 'Xiaomi', NULL, '2025-04-05 15:16:07', '2025-04-05 15:16:07'),
(4, 'Apple', NULL, '2025-04-05 15:16:16', '2025-04-05 15:16:16'),
(5, 'LG', NULL, '2025-04-05 15:16:28', '2025-04-05 15:16:28'),
(6, 'Sony', NULL, '2025-04-06 08:36:20', '2025-04-06 08:36:20'),
(7, 'Oppo', NULL, '2025-04-06 08:36:31', '2025-04-06 08:36:31'),
(8, 'Nokia', NULL, '2025-04-06 08:36:49', '2025-04-06 08:36:49'),
(9, 'Google', NULL, '2025-04-06 08:37:25', '2025-04-06 08:37:25'),
(10, 'OnePlus', NULL, '2025-04-06 08:37:39', '2025-04-06 08:37:39'),
(11, 'Huawei', NULL, '2025-04-06 08:38:44', '2025-04-06 08:38:44'),
(12, 'Realme', NULL, '2025-04-06 08:52:26', '2025-04-06 08:52:26'),
(13, 'Asus', NULL, '2025-04-06 08:52:42', '2025-04-06 08:52:42'),
(14, 'Vivo', NULL, '2025-04-06 08:52:59', '2025-04-06 08:52:59');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Do gia dung', NULL, '2025-04-05 15:18:09', '2025-04-05 15:18:09'),
(2, 'Thoi trang', NULL, '2025-04-05 15:18:32', '2025-04-05 15:18:32'),
(3, 'Dien thoai thong minh', NULL, '2025-04-05 15:18:55', '2025-04-05 15:18:55'),
(4, 'may tinh bang', NULL, '2025-04-05 15:19:06', '2025-04-05 15:19:06');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `star` int(11) DEFAULT NULL,
  `content` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` text,
  `content` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `news_details`
--

CREATE TABLE `news_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `note` text,
  `total` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT '0',
  `oldprice` int(11) DEFAULT '0',
  `image` text,
  `description` text,
  `specification` text,
  `buyturn` int(11) DEFAULT '0',
  `quantity` int(11) DEFAULT '0',
  `brand_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `oldprice`, `image`, `description`, `specification`, `buyturn`, `quantity`, `brand_id`, `category_id`, `created_at`, `updated_at`) VALUES
(3, 'Galaxy S22 Ultra', 24990000, 27990000, '', 'Galaxy S22 Ultra voi but S Pen tich hop, hieu nang dot pha va kha nang chup anh chuyen nghiep, la su ket hop hoan hao giua dien thoai va may tinh bang trong mot thiet ke sang trong.', 'Man hinh Dynamic AMOLED 2X 6.8 inch, do phan giai 3200x1440; Chipset Exynos 2200; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 108MP, ultra-wide 12MP, telephoto 10MP va periscope 10MP; Camera truoc: 40MP; Pin 5000 mAh voi sac sieu nhanh.', 320, 85, 1, 3, '2025-04-05 16:51:19', '2025-04-05 16:51:19'),
(5, 'iPhone 14 Pro Max', 35990000, 38990000, '', 'iPhone 14 Pro Max voi man hinh Super Retina XDR 6.7 inch, chip A16 Bionic manh me va he thong camera 48MP giup tao ra nhung buc anh sac net va chat luong.', 'Man hinh Super Retina XDR 6.7 inch, do phan giai 2778x1284; Chipset A16 Bionic; RAM 6GB; Bo nho trong 128GB; Camera sau: chinh 48MP, ultra-wide 12MP, telephoto 12MP; Camera truoc: 12MP; Pin 4323 mAh voi sac nhanh.', 420, 75, 4, 3, '2025-04-06 09:02:32', '2025-04-06 09:02:32'),
(6, 'Samsung Galaxy Z Fold 4', 44990000, 49990000, '', 'Galaxy Z Fold 4 voi man hinh gap doc dao va hieu suat manh me, la lua chon ly tuong cho nhung ai yeu thich trai nghiem da nhiem va sang tao.', 'Man hinh chinh Dynamic AMOLED 2X 7.6 inch, do phan giai 2208x1768; Chipset Snapdragon 8+ Gen 1; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 12MP, telephoto 10MP; Camera truoc: 10MP va 4MP duoi man hinh; Pin 4400 mAh.', 185, 60, 1, 3, '2025-04-06 09:02:46', '2025-04-06 09:02:46'),
(7, 'Xiaomi Mi 13 Pro', 24990000, 26990000, '', 'Xiaomi Mi 13 Pro voi camera 50MP, chip Snapdragon 8 Gen 2 va man hinh AMOLED 6.73 inch mang den trai nghiem tuyet voi ve hieu suat va hinh anh.', 'Man hinh AMOLED 6.73 inch, do phan giai 3200x1440; Chipset Snapdragon 8 Gen 2; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 50MP, telephoto 50MP; Camera truoc: 32MP; Pin 4820 mAh voi sac nhanh.', 300, 90, 3, 3, '2025-04-06 09:02:56', '2025-04-06 09:02:56'),
(8, 'Oppo Find X5 Pro', 25990000, 28990000, '', 'Oppo Find X5 Pro voi camera chinh 50MP, hieu suat manh me tu chip MediaTek Dimensity 9000 va thiet ke cao cap.', 'Man hinh AMOLED 6.7 inch, do phan giai 3216x1440; Chipset MediaTek Dimensity 9000; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 50MP, telephoto 13MP; Camera truoc: 32MP; Pin 5000 mAh voi sac nhanh.', 250, 100, 7, 3, '2025-04-06 09:03:04', '2025-04-06 09:03:04'),
(9, 'OnePlus 11', 22990000, 24990000, '', 'OnePlus 11 voi thiet ke thanh lich, chip Snapdragon 8 Gen 2 va he thong camera tien tien giup nguoi dung trai nghiem toc do va su sang tao.', 'Man hinh AMOLED 6.7 inch, do phan giai 3216x1440; Chipset Snapdragon 8 Gen 2; RAM 12GB; Bo nho trong 128GB; Camera sau: chinh 50MP, ultra-wide 48MP, telephoto 32MP; Camera truoc: 16MP; Pin 5000 mAh voi sac nhanh.', 380, 110, 10, 3, '2025-04-06 09:03:13', '2025-04-06 09:03:13'),
(10, 'Sony Xperia 1 IV', 28990000, 31990000, '', 'Sony Xperia 1 IV mang den man hinh OLED 4K 6.5 inch, cung voi kha nang quay video chuyen nghiep va cac tinh nang da phuong tien hang dau.', 'Man hinh OLED 4K 6.5 inch, do phan giai 3840x1644; Chipset Snapdragon 8 Gen 1; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 12MP, ultra-wide 12MP, telephoto 12MP; Camera truoc: 12MP; Pin 5000 mAh voi sac nhanh.', 210, 95, 6, 3, '2025-04-06 09:03:22', '2025-04-06 09:03:22'),
(11, 'Google Pixel 7 Pro', 24990000, 26990000, '', 'Google Pixel 7 Pro voi he thong camera AI manh me va chip Tensor giup mang lai hieu suat va trai nghiem hinh anh tuyet voi.', 'Man hinh LTPO AMOLED 6.7 inch, do phan giai 3120x1440; Chipset Google Tensor G2; RAM 12GB; Bo nho trong 128GB; Camera sau: chinh 50MP, ultra-wide 12MP, telephoto 48MP; Camera truoc: 10.8MP; Pin 5000 mAh voi sac nhanh.', 270, 80, 9, 3, '2025-04-06 09:03:29', '2025-04-06 09:03:29'),
(12, 'Realme GT 2 Pro', 18990000, 21990000, '', 'Realme GT 2 Pro mang den trai nghiem choi game muot ma, hieu suat vuot troi voi chip Snapdragon 8 Gen 1 va man hinh AMOLED chat luong cao.', 'Man hinh AMOLED 6.7 inch, do phan giai 3216x1440; Chipset Snapdragon 8 Gen 1; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 50MP, macro 3MP; Camera truoc: 32MP; Pin 5000 mAh voi sac nhanh.', 160, 70, 12, 3, '2025-04-06 09:03:37', '2025-04-06 09:03:37'),
(13, 'Asus ROG Phone 6 Pro', 34990000, 37990000, '', 'Asus ROG Phone 6 Pro la su lua chon ly tuong cho game thu, voi man hinh AMOLED 6.78 inch, chip Snapdragon 8+ Gen 1 va he thong tan nhiet hieu qua.', 'Man hinh AMOLED 6.78 inch, do phan giai 2448x1080; Chipset Snapdragon 8+ Gen 1; RAM 18GB; Bo nho trong 512GB; Camera sau: chinh 50MP, ultra-wide 13MP, macro 5MP; Camera truoc: 12MP; Pin 6000 mAh voi sac nhanh.', 310, 50, 13, 3, '2025-04-06 09:03:47', '2025-04-06 09:03:47'),
(14, 'Vivo X90 Pro', 29990000, 32990000, '', 'Vivo X90 Pro voi he thong camera ZEISS 50MP, man hinh AMOLED 6.78 inch va chip MediaTek Dimensity 9200 mang lai trai nghiem tuyet voi cho nguoi dung.', 'Man hinh AMOLED 6.78 inch, do phan giai 3200x1440; Chipset MediaTek Dimensity 9200; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 50MP, telephoto 50MP; Camera truoc: 32MP; Pin 4800 mAh voi sac nhanh.', 200, 85, 14, 3, '2025-04-06 09:03:56', '2025-04-06 09:03:56'),
(15, 'Huawei Mate 50 Pro', 35990000, 38990000, '', 'Huawei Mate 50 Pro voi camera 50MP, chip Snapdragon 8 Gen 1 va man hinh OLED 6.74 inch, la su ket hop hoan hao giua cong nghe va thiet ke.', 'Man hinh OLED 6.74 inch, do phan giai 2616x1212; Chipset Snapdragon 8 Gen 1; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 13MP, telephoto 64MP; Camera truoc: 13MP; Pin 4700 mAh voi sac nhanh.', 230, 95, 11, 3, '2025-04-06 09:04:04', '2025-04-06 09:04:04'),
(16, 'Samsung Galaxy S23 Ultra', 42990000, 46990000, '', 'Samsung Galaxy S23 Ultra voi camera chinh 200MP, chip Snapdragon 8 Gen 2, man hinh Dynamic AMOLED 2X 6.8 inch mang den hieu suat vuot troi.', 'Man hinh Dynamic AMOLED 2X 6.8 inch, do phan giai 3088x1440; Chipset Snapdragon 8 Gen 2; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 200MP, ultra-wide 12MP, telephoto 10MP, periscope 10MP; Camera truoc: 12MP; Pin 5000 mAh voi sac nhanh.', 450, 120, 1, 3, '2025-04-06 09:04:16', '2025-04-06 09:04:16'),
(17, 'iPhone 15 Pro', 39990000, 42990000, '', 'iPhone 15 Pro voi chip A17 Bionic, camera 48MP, man hinh OLED Super Retina XDR mang den anh sang chat luong cao.', 'Man hinh OLED Super Retina XDR 6.1 inch, do phan giai 2532x1170; Chipset A17 Bionic; RAM 8GB; Bo nho trong 128GB; Camera sau: chinh 48MP, ultra-wide 12MP, telephoto 12MP; Camera truoc: 12MP; Pin 3300 mAh voi sac nhanh.', 375, 85, 4, 3, '2025-04-06 09:04:23', '2025-04-06 09:04:23'),
(18, 'Xiaomi 13 Ultra', 27990000, 31990000, '', 'Xiaomi 13 Ultra voi he thong camera 200MP, chip Snapdragon 8 Gen 2, man hinh AMOLED 6.73 inch mang den trai nghiem hinh anh toi uu.', 'Man hinh AMOLED 6.73 inch, do phan giai 3200x1440; Chipset Snapdragon 8 Gen 2; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 200MP, ultra-wide 50MP, telephoto 50MP; Camera truoc: 32MP; Pin 5000 mAh voi sac nhanh.', 310, 100, 3, 3, '2025-04-06 09:05:12', '2025-04-06 09:05:12'),
(19, 'Oppo Reno 8 Pro', 17990000, 19990000, '', 'Oppo Reno 8 Pro voi camera chinh 50MP, chip MediaTek Dimensity 8100 Max, man hinh AMOLED 6.7 inch mang den hieu suat nhanh va chinh xac.', 'Man hinh AMOLED 6.7 inch, do phan giai 2412x1080; Chipset MediaTek Dimensity 8100 Max; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 8MP, macro 2MP; Camera truoc: 32MP; Pin 4500 mAh voi sac nhanh.', 240, 130, 7, 3, '2025-04-06 09:05:21', '2025-04-06 09:05:21'),
(20, 'Realme 11 Pro+', 21990000, 23990000, '', 'Realme 11 Pro+ voi man hinh AMOLED 6.7 inch, camera 200MP, chip MediaTek Dimensity 1080 mang den hieu suat kha nang chup anh tot.', 'Man hinh AMOLED 6.7 inch, do phan giai 2412x1080; Chipset MediaTek Dimensity 1080; RAM 12GB; Bo nho trong 256GB; Camera sau: chinh 200MP, ultra-wide 8MP, macro 2MP; Camera truoc: 32MP; Pin 5000 mAh voi sac nhanh.', 280, 115, 12, 3, '2025-04-06 09:05:34', '2025-04-06 09:05:34'),
(21, 'Asus Zenfone 9', 16990000, 18990000, '', 'Asus Zenfone 9 voi chip Snapdragon 8 Gen 1, man hinh AMOLED 5.9 inch, mang den hieu suat nhanh va bo nho trong 128GB.', 'Man hinh AMOLED 5.9 inch, do phan giai 2400x1080; Chipset Snapdragon 8 Gen 1; RAM 8GB; Bo nho trong 128GB; Camera sau: chinh 50MP, ultra-wide 12MP; Camera truoc: 12MP; Pin 4300 mAh voi sac nhanh.', 150, 90, 13, 3, '2025-04-06 09:05:41', '2025-04-06 09:05:41'),
(22, 'Vivo V27 Pro', 22990000, 24990000, '', 'Vivo V27 Pro voi camera chinh 50MP, chip MediaTek Dimensity 8200, man hinh AMOLED 6.78 inch mang den anh sang dep.', 'Man hinh AMOLED 6.78 inch, do phan giai 2400x1080; Chipset MediaTek Dimensity 8200; RAM 8GB; Bo nho trong 256GB; Camera sau: chinh 50MP, ultra-wide 8MP, macro 2MP; Camera truoc: 50MP; Pin 4600 mAh voi sac nhanh.', 230, 120, 14, 3, '2025-04-06 09:05:50', '2025-04-06 09:05:50');

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `check_buyturn_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
  IF NEW.buyturn < 0 THEN
    SET NEW.buyturn = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_buyturn_before_update` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
  IF NEW.buyturn < 0 THEN
    SET NEW.buyturn = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_oldprice_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
  IF NEW.oldprice < 0 THEN
    SET NEW.oldprice = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_oldprice_before_update` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
  IF NEW.oldprice < 0 THEN
    SET NEW.oldprice = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_price_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
  IF NEW.price < 0 THEN
    SET NEW.price = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_price_before_update` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
  IF NEW.price < 0 THEN
    SET NEW.price = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_quantity_before_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
  IF NEW.quantity < 0 THEN
    SET NEW.quantity = 0;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `check_quantity_before_update` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
  IF NEW.quantity < 0 THEN
    SET NEW.quantity = 0;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250403073356-create-user.js'),
('20250403153714-update-users-table-defaults.js'),
('20250403155809-create-category.js'),
('20250403160952-create-brand.js'),
('20250403161426-create-news.js'),
('20250403161427-create-banner.js'),
('20250403164117-create-order.js'),
('20250404044225-create-product.js'),
('20250404081712-create-order-detail.js'),
('20250404084043-create-banner-detail.js'),
('20250404092018-create-feedback.js'),
('20250404093537-create-news-detail.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banner_details`
--
ALTER TABLE `banner_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `banner_id` (`banner_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_details`
--
ALTER TABLE `news_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banner_details`
--
ALTER TABLE `banner_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_details`
--
ALTER TABLE `news_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banner_details`
--
ALTER TABLE `banner_details`
  ADD CONSTRAINT `banner_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `banner_details_ibfk_2` FOREIGN KEY (`banner_id`) REFERENCES `banners` (`id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `news_details`
--
ALTER TABLE `news_details`
  ADD CONSTRAINT `news_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `news_details_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
