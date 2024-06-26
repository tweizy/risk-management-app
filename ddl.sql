CREATE TYPE entity_type AS ENUM ('Division', 'Service');
CREATE TYPE risk_response_enum AS ENUM ('Decrease', 'Transfer', 'Accept');

CREATE TABLE Entity (
    id SERIAL PRIMARY KEY,
    parent_id INT,
    description VARCHAR(255) NOT NULL,
    type entity_type NOT NULL,
    CONSTRAINT chk_entity_type CHECK (type IN ('Division', 'Service')),
    CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES Entity(id)
);

CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Users ( -- couldn't name this table: User since PSQL does not allow this name.
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    entity_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_entity_id FOREIGN KEY (entity_id) REFERENCES Entity(id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES Role(id)
);

CREATE TABLE Project (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE Event (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RiskCategory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Risk (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    triggering_event_id INT NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_risk_response CHECK (risk_response IN ('Decrease', 'Transfer', 'Accept')),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_projet_id FOREIGN KEY (project_id) REFERENCES Project(id),
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES RiskCategory(id),
    CONSTRAINT fk_triggering_event_id FOREIGN KEY (triggering_event_id) REFERENCES Event(id)
);

CREATE TABLE Attachment (
    id SERIAL PRIMARY KEY,
    risk_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES Risk(id) ON DELETE CASCADE
);

CREATE TABLE RiskEvaluation (
    id SERIAL PRIMARY KEY,
    risk_id INT NOT NULL,
    evaluation_date TIMESTAMP NOT NULL,
    probability INT CHECK (probability >= 1 AND probability <= 5) NOT NULL,
    impact INT CHECK (impact >= 1 AND impact <= 5) NOT NULL,
    score INT GENERATED ALWAYS AS (probability * impact) STORED,
    user_id INT NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES Risk(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE MitigationAction (
    id SERIAL PRIMARY KEY,
    risk_id INT NOT NULL,
    action_description TEXT NOT NULL,
    assigned_to INT NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_id FOREIGN KEY (risk_id) REFERENCES Risk(id) ON DELETE CASCADE,
    CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES Users(id)
);