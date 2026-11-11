<?php
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

// Initialize tables if connected
if ($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS candidates (
            id VARCHAR(64) PRIMARY KEY,
            row_number INT NULL,
            tracking_code VARCHAR(64) NULL,
            assignee VARCHAR(255) NULL,
            resume_submission_date VARCHAR(64) NULL,
            name VARCHAR(255) NOT NULL,
            gender VARCHAR(32) NULL,
            national_id VARCHAR(32) NULL,
            phone VARCHAR(64) NULL,
            role VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL,
            source VARCHAR(64) NULL,
            site_message_date VARCHAR(64) NULL,
            time_passed VARCHAR(64) NULL,
            is_message_received VARCHAR(32) NULL,
            is_site_completed VARCHAR(32) NULL,
            site_incompletion_reason TEXT NULL,
            is_resume_approved VARCHAR(32) NULL,
            job_priority_score FLOAT NULL,
            site_completion_score FLOAT NULL,
            remarks TEXT NULL,
            current_stage_fa VARCHAR(128) NULL,
            requested_salary VARCHAR(128) NULL,
            status VARCHAR(64) NOT NULL DEFAULT 'APPLIED',
            email VARCHAR(255) NULL,
            experience_years INT DEFAULT 0,
            location VARCHAR(128) NULL,
            salary_expectation VARCHAR(128) NULL,
            rating FLOAT DEFAULT 4.0,
            skills_json TEXT NULL,
            education VARCHAR(255) NULL,
            summary TEXT NULL,
            notes_json TEXT NULL,
            is_bookmarked TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS requisitions (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL,
            location VARCHAR(255) NULL,
            employment_type VARCHAR(64) NULL,
            open_positions INT DEFAULT 1,
            filled_positions INT DEFAULT 0,
            status VARCHAR(64) DEFAULT 'ACTIVE',
            priority VARCHAR(64) DEFAULT 'HIGH',
            budget_range VARCHAR(128) NULL,
            applicants_count INT DEFAULT 0,
            posted_date VARCHAR(64) NULL,
            hiring_manager VARCHAR(255) NULL,
            description TEXT NULL,
            skills_json TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS departments (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            name_en VARCHAR(255) NULL,
            code VARCHAR(64) NULL,
            head_of_department VARCHAR(255) NULL,
            head_email VARCHAR(255) NULL,
            description TEXT NULL,
            budget_total VARCHAR(128) NULL,
            open_positions_count INT DEFAULT 0,
            active_employees_count INT DEFAULT 0,
            color VARCHAR(128) NULL,
            created_at VARCHAR(64) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS interviews (
            id VARCHAR(64) PRIMARY KEY,
            candidate_id VARCHAR(64) NOT NULL,
            candidate_name VARCHAR(255) NOT NULL,
            candidate_role VARCHAR(255) NULL,
            stage_name VARCHAR(255) NULL,
            stage_config_id VARCHAR(64) NULL,
            interview_type VARCHAR(64) NULL,
            interviewers_json TEXT NULL,
            date_time VARCHAR(128) NULL,
            time_only VARCHAR(64) NULL,
            duration_minutes INT DEFAULT 60,
            meet_url VARCHAR(512) NULL,
            is_completed TINYINT(1) DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS interview_stages (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            title_en VARCHAR(255) NULL,
            type VARCHAR(64) NULL,
            default_duration_minutes INT DEFAULT 45,
            description TEXT NULL,
            evaluators_hint TEXT NULL,
            color VARCHAR(128) NULL,
            created_at VARCHAR(64) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!$pdo) {
        echo json_encode(['status' => 'local_fallback', 'message' => 'No DB connection']);
        exit();
    }

    try {
        // Fetch candidates
        $stmt = $pdo->query("SELECT * FROM candidates ORDER BY id DESC");
        $rawCandidates = $stmt->fetchAll();
        $candidates = array_map(function($c) {
            return [
                'id' => $c['id'],
                'rowNumber' => (int)($c['row_number'] ?? 0),
                'trackingCode' => $c['tracking_code'],
                'assignee' => $c['assignee'],
                'resumeSubmissionDate' => $c['resume_submission_date'],
                'name' => $c['name'],
                'gender' => $c['gender'],
                'nationalId' => $c['national_id'],
                'phone' => $c['phone'],
                'role' => $c['role'],
                'department' => $c['department'],
                'source' => $c['source'],
                'siteMessageDate' => $c['site_message_date'],
                'timePassed' => $c['time_passed'],
                'isMessageReceived' => $c['is_message_received'],
                'isSiteCompleted' => $c['is_site_completed'],
                'siteIncompletionReason' => $c['site_incompletion_reason'],
                'isResumeApproved' => $c['is_resume_approved'],
                'jobPriorityScore' => (float)($c['job_priority_score'] ?? 3),
                'siteCompletionScore' => (float)($c['site_completion_score'] ?? 8),
                'remarks' => $c['remarks'],
                'currentStageFa' => $c['current_stage_fa'],
                'requestedSalary' => $c['requested_salary'],
                'appliedDate' => $c['resume_submission_date'] ?: '۱۴۰۳/۰۶/۰۱',
                'experienceYears' => (int)($c['experience_years'] ?? 3),
                'currentCompany' => $c['current_company'] ?? '',
                'location' => $c['location'] ?? 'تهران',
                'status' => $c['status'],
                'email' => $c['email'] ?? '',
                'matchScore' => 88,
                'rating' => (float)($c['rating'] ?? 4.5),
                'skills' => json_decode($c['skills_json'] ?? '[]', true) ?: [$c['role']],
                'education' => $c['education'] ?? '',
                'salaryExpectation' => $c['salary_expectation'] ?? $c['requested_salary'],
                'summary' => $c['summary'] ?? $c['remarks'],
                'notes' => json_decode($c['notes_json'] ?? '[]', true) ?: [],
                'isBookmarked' => (bool)$c['is_bookmarked']
            ];
        }, $rawCandidates);

        // Fetch Requisitions
        $stmt = $pdo->query("SELECT * FROM requisitions ORDER BY id DESC");
        $rawReqs = $stmt->fetchAll();
        $requisitions = array_map(function($r) {
            return [
                'id' => $r['id'],
                'title' => $r['title'],
                'department' => $r['department'],
                'location' => $r['location'],
                'employmentType' => $r['employment_type'],
                'openPositions' => (int)$r['open_positions'],
                'filledPositions' => (int)$r['filled_positions'],
                'status' => $r['status'],
                'priority' => $r['priority'],
                'budgetRange' => $r['budget_range'],
                'applicantsCount' => (int)$r['applicants_count'],
                'postedDate' => $r['posted_date'],
                'hiringManager' => $r['hiring_manager'],
                'description' => $r['description'],
                'requiredSkills' => json_decode($r['skills_json'] ?? '[]', true) ?: []
            ];
        }, $rawReqs);

        // Fetch Departments
        $stmt = $pdo->query("SELECT * FROM departments ORDER BY id ASC");
        $departments = $stmt->fetchAll();

        // Fetch Interviews
        $stmt = $pdo->query("SELECT * FROM interviews ORDER BY id DESC");
        $rawInterviews = $stmt->fetchAll();
        $interviews = array_map(function($i) {
            return [
                'id' => $i['id'],
                'candidateId' => $i['candidate_id'],
                'candidateName' => $i['candidate_name'],
                'candidateRole' => $i['candidate_role'],
                'stageName' => $i['stage_name'],
                'stageConfigId' => $i['stage_config_id'],
                'interviewType' => $i['interview_type'],
                'interviewers' => json_decode($i['interviewers_json'] ?? '[]', true) ?: [],
                'dateTime' => $i['date_time'],
                'timeOnly' => $i['time_only'],
                'durationMinutes' => (int)$i['duration_minutes'],
                'meetUrl' => $i['meet_url'],
                'isCompleted' => (bool)$i['is_completed']
            ];
        }, $rawInterviews);

        // Fetch Stages
        $stmt = $pdo->query("SELECT * FROM interview_stages ORDER BY id ASC");
        $interviewStages = $stmt->fetchAll();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'candidates' => $candidates,
                'requisitions' => $requisitions,
                'departments' => $departments,
                'interviews' => $interviews,
                'interviewStages' => $interviewStages
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit();
}

if ($method === 'POST') {
    if (!$pdo) {
        echo json_encode(['status' => 'local_fallback', 'message' => 'No DB connection']);
        exit();
    }

    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true);

    $action = $body['action'] ?? '';
    $data = $body['data'] ?? [];

    try {
        if ($action === 'SAVE_CANDIDATE') {
            $stmt = $pdo->prepare("
                REPLACE INTO candidates (
                    id, row_number, tracking_code, assignee, resume_submission_date,
                    name, gender, national_id, phone, role, department, source,
                    site_message_date, time_passed, is_message_received, is_site_completed,
                    site_incompletion_reason, is_resume_approved, job_priority_score,
                    site_completion_score, remarks, current_stage_fa, requested_salary,
                    status, email, experience_years, location, salary_expectation,
                    rating, skills_json, education, summary, notes_json, is_bookmarked
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?
                )
            ");
            $stmt->execute([
                $data['id'],
                $data['rowNumber'] ?? null,
                $data['trackingCode'] ?? null,
                $data['assignee'] ?? null,
                $data['resumeSubmissionDate'] ?? null,
                $data['name'],
                $data['gender'] ?? null,
                $data['nationalId'] ?? null,
                $data['phone'] ?? null,
                $data['role'],
                $data['department'],
                $data['source'] ?? null,
                $data['siteMessageDate'] ?? null,
                $data['timePassed'] ?? null,
                $data['isMessageReceived'] ?? null,
                $data['isSiteCompleted'] ?? null,
                $data['siteIncompletionReason'] ?? null,
                $data['isResumeApproved'] ?? null,
                $data['jobPriorityScore'] ?? 3,
                $data['siteCompletionScore'] ?? 8,
                $data['remarks'] ?? null,
                $data['currentStageFa'] ?? null,
                $data['requestedSalary'] ?? null,
                $data['status'] ?? 'APPLIED',
                $data['email'] ?? null,
                $data['experienceYears'] ?? 0,
                $data['location'] ?? 'تهران',
                $data['salaryExpectation'] ?? null,
                $data['rating'] ?? 4.5,
                json_encode($data['skills'] ?? []),
                $data['education'] ?? null,
                $data['summary'] ?? null,
                json_encode($data['notes'] ?? []),
                !empty($data['isBookmarked']) ? 1 : 0
            ]);
            echo json_encode(['status' => 'success']);
        } elseif ($action === 'SAVE_CANDIDATES_BULK') {
            $candidatesList = $data['candidates'] ?? [];
            $stmt = $pdo->prepare("
                REPLACE INTO candidates (
                    id, row_number, tracking_code, assignee, resume_submission_date,
                    name, gender, national_id, phone, role, department, source,
                    site_message_date, time_passed, is_message_received, is_site_completed,
                    site_incompletion_reason, is_resume_approved, job_priority_score,
                    site_completion_score, remarks, current_stage_fa, requested_salary,
                    status, email, experience_years, location, salary_expectation,
                    rating, skills_json, education, summary, notes_json, is_bookmarked
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?
                )
            ");

            $pdo->beginTransaction();
            foreach ($candidatesList as $cand) {
                $stmt->execute([
                    $cand['id'],
                    $cand['rowNumber'] ?? null,
                    $cand['trackingCode'] ?? null,
                    $cand['assignee'] ?? null,
                    $cand['resumeSubmissionDate'] ?? null,
                    $cand['name'],
                    $cand['gender'] ?? null,
                    $cand['nationalId'] ?? null,
                    $cand['phone'] ?? null,
                    $cand['role'],
                    $cand['department'],
                    $cand['source'] ?? null,
                    $cand['siteMessageDate'] ?? null,
                    $cand['timePassed'] ?? null,
                    $cand['isMessageReceived'] ?? null,
                    $cand['isSiteCompleted'] ?? null,
                    $cand['siteIncompletionReason'] ?? null,
                    $cand['isResumeApproved'] ?? null,
                    $cand['jobPriorityScore'] ?? 3,
                    $cand['siteCompletionScore'] ?? 8,
                    $cand['remarks'] ?? null,
                    $cand['currentStageFa'] ?? null,
                    $cand['requestedSalary'] ?? null,
                    $cand['status'] ?? 'APPLIED',
                    $cand['email'] ?? null,
                    $cand['experienceYears'] ?? 0,
                    $cand['location'] ?? 'تهران',
                    $cand['salaryExpectation'] ?? null,
                    $cand['rating'] ?? 4.5,
                    json_encode($cand['skills'] ?? []),
                    $cand['education'] ?? null,
                    $cand['summary'] ?? null,
                    json_encode($cand['notes'] ?? []),
                    !empty($cand['isBookmarked']) ? 1 : 0
                ]);
            }
            $pdo->commit();
            echo json_encode(['status' => 'success', 'count' => count($candidatesList)]);
        } elseif ($action === 'DELETE_CANDIDATE') {
            $stmt = $pdo->prepare("DELETE FROM candidates WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'success']);
        }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
