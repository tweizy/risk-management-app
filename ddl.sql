CREATE TYPE entity_type AS ENUM ('Division', 'Service');

CREATE TABLE Entity (
    id SERIAL PRIMARY KEY,
    parent_id INT,
    description VARCHAR(255) NOT NULL,
    type entity_type NOT NULL,
    CONSTRAINT chk_entity_type CHECK (type IN ('Division', 'Service')),
    CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES Entity(id)
);

CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    entity_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_entity_id FOREIGN KEY (entity_id) REFERENCES Entity(id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES Roles(id)
);

CREATE TABLE Project (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE RiskCategory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TYPE risk_response_enum AS ENUM ('Decrease', 'Transfer', 'Accept');

CREATE TABLE Risks (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    triggering_event VARCHAR(255) NOT NULL,
    probability INT CHECK (probability >= 1 AND probability <= 5) NOT NULL,
    impact INT CHECK (impact >= 1 AND impact <= 5) NOT NULL,
    risk_response risk_response_enum NOT NULL,
    score INT GENERATED ALWAYS AS (probability * impact) STORED,
    response_strategy VARCHAR(255) NOT NULL,
    expected_result VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    note VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT chk_risk_response CHECK (risk_response IN ('Decrease', 'Transfer', 'Accept')),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_projet_id FOREIGN KEY (project_id) REFERENCES Project(id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES RiskCategory(id)
);

