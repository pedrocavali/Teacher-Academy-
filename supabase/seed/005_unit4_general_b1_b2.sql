-- Unit 4 (General track, B1-B2): "Work and Study"
-- Three original lessons -- Job Interviews, Emails and Messages, Problem
-- Solving at Work -- covering the present perfect for experience, formal
-- vs informal register, and the second conditional. All text is original,
-- written for this platform.
--
-- Run once in the Supabase SQL Editor, after Units 1-3's seeds have
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('d154eef8-aff6-4e65-a8e8-a1c8eb2669cb', (select id from public.courses where slug = 'general-english'), 'work-and-study', 'Work and Study', 'Job interviews, workplace writing, and problem solving in English.', 'general', 4, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('1d6202f7-96ec-49aa-8886-505f5e65d934', 'd154eef8-aff6-4e65-a8e8-a1c8eb2669cb', 'job-interviews', 'Job Interviews', 'Talk about past work experience using the present perfect.', 'B1', 'grammar', 1, 15, 'published'),
('9090eda8-e386-4c68-b397-a63dfc634749', 'd154eef8-aff6-4e65-a8e8-a1c8eb2669cb', 'emails-and-messages', 'Emails and Messages', 'Choose formal or informal language depending on who you are writing to.', 'B2', 'vocabulary', 2, 15, 'published'),
('9853086b-4156-45b6-bede-d2e5020a2d57', 'd154eef8-aff6-4e65-a8e8-a1c8eb2669cb', 'problem-solving-at-work', 'Problem Solving at Work', 'Talk about hypothetical situations at work using the second conditional.', 'B2', 'grammar', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('1d6202f7-96ec-49aa-8886-505f5e65d934', 'reading_passage', 'In a job interview, you may hear questions like: "What experience do you have?" or "Have you ever managed a team?" It''s a good idea to prepare short, clear answers using real examples from your past jobs.', 1),
('9090eda8-e386-4c68-b397-a63dfc634749', 'reading_passage', 'At work, the way you write depends on who you are writing to. A message to a close colleague can be informal: "Hey, can you send me that file?" A message to a client or manager should usually be more formal: "Could you please send me the file when you have a moment?"', 1),
('9853086b-4156-45b6-bede-d2e5020a2d57', 'reading_passage', 'Imagine your team missed an important deadline. What would you do? If I were the manager, I would talk to the team calmly and find out what went wrong. If we understood the real problem, we could avoid it next time.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('c35267aa-7905-4f05-bdd2-f45ab910e3a8', '1d6202f7-96ec-49aa-8886-505f5e65d934', 'multiple_choice', 'grammar', 1, 'Choose the correct form of the verb, based on the text above.', 5, 'published'),
('c9663044-bf1e-46a8-ad86-b8a58fa07691', '1d6202f7-96ec-49aa-8886-505f5e65d934', 'speaking', 'speaking', 2, 'Answer this interview question out loud: "Tell me about a time you solved a problem at work."', 5, 'published'),
('227d39ec-da69-4215-9e82-41899dc6d345', '9090eda8-e386-4c68-b397-a63dfc634749', 'multiple_choice', 'vocabulary', 1, 'Choose the best answer, based on the text above.', 5, 'published'),
('ffb3d4c9-7207-4a35-bab8-784a5ef4c395', '9090eda8-e386-4c68-b397-a63dfc634749', 'fill_blank', 'vocabulary', 2, 'Complete the formal request with the missing word.', 3, 'published'),
('e09a710c-18e7-4211-85e4-353ec1800ddf', '9853086b-4156-45b6-bede-d2e5020a2d57', 'multiple_choice', 'grammar', 1, 'Choose the correct form, based on the text above.', 5, 'published'),
('359568fa-72f6-4987-b565-bd9d78c9c08b', '9853086b-4156-45b6-bede-d2e5020a2d57', 'writing', 'writing', 2, 'Write 3-4 sentences: what would you do if your team missed a deadline?', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('77cf30aa-878e-41e5-8daa-7aa44c5531a4', 'c35267aa-7905-4f05-bdd2-f45ab910e3a8', '"Have you ever ___ a team?"', 'multiple_choice', 1),
('020a6e1d-7cea-40ab-8a19-2856e9783c9b', 'c35267aa-7905-4f05-bdd2-f45ab910e3a8', '"I ___ worked in customer service for three years."', 'multiple_choice', 2),
('afc57146-c786-489b-9b0f-d22158083ce4', 'c35267aa-7905-4f05-bdd2-f45ab910e3a8', 'True or false: it''s a good idea to prepare answers before an interview.', 'true_false', 3),
('5a9af092-5fde-426e-8503-81fa7c7b32e2', '227d39ec-da69-4215-9e82-41899dc6d345', 'Which sentence is more formal?', 'multiple_choice', 1),
('b8788b5f-f4ac-4c5d-adcd-0330049aaf14', '227d39ec-da69-4215-9e82-41899dc6d345', 'Which sentence is more appropriate for a close colleague?', 'multiple_choice', 2),
('be394272-e3bf-4859-93c4-69cba7373e09', '227d39ec-da69-4215-9e82-41899dc6d345', 'True or false: formal and informal writing always use exactly the same words.', 'true_false', 3),
('513521b4-49b0-471d-82b6-3972d21d32e4', 'ffb3d4c9-7207-4a35-bab8-784a5ef4c395', '"___ you please send me the report by Friday?"', 'fill_blank', 1),
('79149973-ee75-43f0-85b0-825428eed51e', 'e09a710c-18e7-4211-85e4-353ec1800ddf', '"If I ___ the manager, I would talk to the team calmly."', 'multiple_choice', 1),
('e96a2b83-cf8f-49b2-ae8e-01e5245afdc1', 'e09a710c-18e7-4211-85e4-353ec1800ddf', '"If we understood the problem, we ___ avoid it next time."', 'multiple_choice', 2),
('b903cf41-95de-434f-86b3-00c4b9bb0de0', 'e09a710c-18e7-4211-85e4-353ec1800ddf', 'True or false: the second conditional describes real, current facts.', 'true_false', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('77cf30aa-878e-41e5-8daa-7aa44c5531a4', 'manage', false, 1),
('77cf30aa-878e-41e5-8daa-7aa44c5531a4', 'managed', true, 2),
('77cf30aa-878e-41e5-8daa-7aa44c5531a4', 'managing', false, 3),
('020a6e1d-7cea-40ab-8a19-2856e9783c9b', 'have', true, 1),
('020a6e1d-7cea-40ab-8a19-2856e9783c9b', 'has', false, 2),
('020a6e1d-7cea-40ab-8a19-2856e9783c9b', 'had', false, 3),
('afc57146-c786-489b-9b0f-d22158083ce4', 'True', true, 1),
('afc57146-c786-489b-9b0f-d22158083ce4', 'False', false, 2),
('5a9af092-5fde-426e-8503-81fa7c7b32e2', 'Hey, send me that file.', false, 1),
('5a9af092-5fde-426e-8503-81fa7c7b32e2', 'Could you please send me the file when you have a moment?', true, 2),
('b8788b5f-f4ac-4c5d-adcd-0330049aaf14', 'Hey, can you send me that file?', true, 1),
('b8788b5f-f4ac-4c5d-adcd-0330049aaf14', 'I would be grateful if you could send the file.', false, 2),
('be394272-e3bf-4859-93c4-69cba7373e09', 'True', false, 1),
('be394272-e3bf-4859-93c4-69cba7373e09', 'False', true, 2),
('513521b4-49b0-471d-82b6-3972d21d32e4', 'Could', true, 1),
('513521b4-49b0-471d-82b6-3972d21d32e4', 'Would', true, 2),
('79149973-ee75-43f0-85b0-825428eed51e', 'was', false, 1),
('79149973-ee75-43f0-85b0-825428eed51e', 'were', true, 2),
('79149973-ee75-43f0-85b0-825428eed51e', 'am', false, 3),
('e96a2b83-cf8f-49b2-ae8e-01e5245afdc1', 'can', false, 1),
('e96a2b83-cf8f-49b2-ae8e-01e5245afdc1', 'could', true, 2),
('e96a2b83-cf8f-49b2-ae8e-01e5245afdc1', 'will', false, 3),
('b903cf41-95de-434f-86b3-00c4b9bb0de0', 'True', false, 1),
('b903cf41-95de-434f-86b3-00c4b9bb0de0', 'False', true, 2);

