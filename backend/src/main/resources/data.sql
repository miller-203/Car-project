TRUNCATE TABLE cars CASCADE;
TRUNCATE TABLE car_categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE agencies RESTART IDENTITY CASCADE;

-- Insert Car Categories with fixed IDs
INSERT INTO car_categories (id, name, name_fr, description, display_order) VALUES
(1, 'Small', 'Petite citadine', 'Small city car', 1),
(2, 'Medium', 'Moyenne', 'Medium size car', 2),
(3, 'Minivan', 'Monospace', 'Minivan for families', 3),
(4, 'SUV', 'SUV', 'Sport Utility Vehicle', 4),
(5, 'Hybrid', 'Hybride', 'Hybrid vehicle', 5),
(6, 'Premium', 'Premium', 'Premium vehicle', 6);

-- =====================================
-- =====================================
INSERT INTO agencies (id, name, city, address, phone_number, email, latitude, longitude, is_airport, airport_code, active, created_at, updated_at) VALUES
(1, 'Aéroport de Fès-Saïss', 'Fès', 'Aéroport Fès-Saïss, Fès, Maroc', '+212 535 625 000', 'fes@carrental.com', 33.9275, -4.9775, true, 'FEZ', true, NOW(), NOW()),
(2, 'Fès Centre Ville', 'Fès', '12 Avenue Hassan II, Fès, Maroc', '+212 535 943 000', 'fes-centre@carrental.com', 34.0333, -5.0000, false, NULL, true, NOW(), NOW()),
(3, 'Aéroport Mohammed V', 'Casablanca', 'Aéroport Mohammed V, Casablanca, Maroc', '+212 522 539 000', 'casa@carrental.com', 33.3675, -7.5897, true, 'CMN', true, NOW(), NOW()),
(4, 'Casablanca Centre', 'Casablanca', '45 Boulevard Mohamed VI, Casablanca, Maroc', '+212 522 456 789', 'casa-centre@carrental.com', 33.5731, -7.5898, false, NULL, true, NOW(), NOW()),
(5, 'Aéroport Marrakech Ménara', 'Marrakech', 'Aéroport Ménara, Marrakech, Maroc', '+212 524 447 000', 'marrakech@carrental.com', 31.6069, -8.0363, true, 'RAK', true, NOW(), NOW()),
(6, 'Marrakech Gueliz', 'Marrakech', '78 Boulevard Mohammed VI, Marrakech, Maroc', '+212 524 421 000', 'marrakech-centre@carrental.com', 31.6295, -8.0091, false, NULL, true, NOW(), NOW()),
(7, 'Aéroport Rabat-Salé', 'Rabat', 'Aéroport Rabat-Salé, Rabat, Maroc', '+212 537 808 000', 'rabat@carrental.com', 34.0511, -6.7515, true, 'RBA', true, NOW(), NOW()),
(8, 'Rabat Agdal', 'Rabat', '23 Avenue de France, Rabat, Maroc', '+212 537 672 000', 'rabat-centre@carrental.com', 34.0049, -6.8426, false, NULL, true, NOW(), NOW()),
(9, 'Aéroport Tanger Ibn Battouta', 'Tanger', 'Aéroport Ibn Battouta, Tanger, Maroc', '+212 539 393 000', 'tanger@carrental.com', 35.7269, -5.9169, true, 'TNG', true, NOW(), NOW()),
(10, 'Tanger Centre', 'Tanger', '56 Boulevard Mohamed VI, Tanger, Maroc', '+212 539 940 000', 'tanger-centre@carrental.com', 35.7595, -5.8340, false, NULL, true, NOW(), NOW()),
(11, 'Aéroport Agadir Al Massira', 'Agadir', 'Aéroport Al Massira, Agadir, Maroc', '+212 528 839 000', 'agadir@carrental.com', 30.3250, -9.4131, true, 'AGA', true, NOW(), NOW()),
(12, 'Agadir Centre', 'Agadir', '89 Boulevard Hassan II, Agadir, Maroc', '+212 528 846 000', 'agadir-centre@carrental.com', 30.4278, -9.5981, false, NULL, true, NOW(), NOW());

-- =====================================
-- =====================================
INSERT INTO cars (category_id, name, model, example_model, year, seats, doors, transmission, fuel_type, is_hybrid, has_air_conditioning, image_url, pay_at_agency_price, pay_now_price, available, created_at, updated_at) VALUES
(1, 'Kia Picanto', 'Picanto', 'Kia Picanto Motion +BVA', 2024, 5, 5, 'Automatique', 'Essence', false, true, '/assets/cars/kia-picanto.png', 1050.53, 913.50, true, NOW(), NOW()),
(1, 'Hyundai i10', 'i10', 'Hyundai i10 Inventive', 2024, 5, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/hyundai-i10.png', 400.70, 218.00, true, NOW(), NOW()),
(1, 'Dacia Sandero', 'Sandero', 'Dacia Sandero', 2024, 5, 4, 'Manuelle', 'Essence', false, true, '/assets/cars/dacia-sandero.png', 545.60, 344.00, true, NOW(), NOW()),
(1, 'MG MG3', 'MG3', 'MG MG3 New model 2025', 2025, 5, 5, 'Automatique', 'Essence', false, true, '/assets/cars/mg-mg3.png', 1267.88, 1102.50, true, NOW(), NOW()),

(2, 'Renault Clio', 'Clio', 'Renault Clio New Generation', 2024, 5, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/renault-clio.png', 1122.98, 976.50, true, NOW(), NOW()),
(2, 'Renault Express', 'Express', 'Renault Express Confort', 2024, 5, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/renault-express.png', 473.16, 281.00, true, NOW(), NOW()),
(2, 'Renault Megane', 'Megane', 'Renault Megane BVA', 2024, 5, 4, 'Automatique', 'Essence', false, true, '/assets/cars/renault-megane.png', 1430.90, 1244.26, true, NOW(), NOW()),
(2, 'Renault Kardian', 'Kardian', 'Renault Kardian', 2024, 5, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/renault-kardian.png', 950.00, 780.00, true, NOW(), NOW()),

(3, 'Dacia Lodgy', 'Lodgy', 'Dacia Lodgy premium 7 places', 2024, 7, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/dacia-lodgy.png', 684.48, 464.76, true, NOW(), NOW()),

(4, 'Dacia Duster', 'Duster', 'Dacia Duster New Evasion', 2024, 5, 5, 'Manuelle', 'Essence', false, true, '/assets/cars/dacia-duster.png', 630.13, 417.50, true, NOW(), NOW()),
(4, 'Audi Q5', 'Q5', 'Audi New Q5 Dynamic', 2024, 5, 5, 'Automatique', 'Essence', false, true, '/assets/cars/audi-q5.png', 3085.26, 2835.00, true, NOW(), NOW()),

(5, 'Renault Arkana', 'Arkana', 'Renault Arkana E-Tech Full Hybrid', 2024, 5, 5, 'Automatique', 'Hybride', true, true, '/assets/cars/renault-arkana.png', 847.48, 606.50, true, NOW(), NOW()),

(6, 'Mercedes-Benz A200', 'A200', 'Mercedes-Benz A200 Progressive BVA', 2024, 5, 5, 'Automatique', 'Essence', false, true, '/assets/cars/mercedes-a200.png', 2898.00, 2520.00, true, NOW(), NOW());


-- Seed default admin user (password: password)
INSERT INTO users (first_name, last_name, email, password, phone_number, role, is_preferred, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@carrental.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOHiHL39xXc5N6iYG3PaY5E9OQj1YxD6.', '+212600000000', 'ADMIN', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
