-- Unit 6 (General track, A2): "Health and Wellbeing"
-- Three original lessons -- Feeling Unwell, Healthy Habits, At the
-- Doctor's -- covering symptoms vocabulary, should/shouldn't for advice,
-- and frequency adverbs. All text is original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after Units 1-5's seeds have
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('68360c4b-9488-4f62-9135-1ed986b68311', (select id from public.courses where slug = 'general-english'), 'health-and-wellbeing', 'Health and Wellbeing', 'Talking about symptoms, habits, and visits to the doctor.', 'general', 6, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('6d21d61a-ea61-490b-93d2-f64be4acac0a', '68360c4b-9488-4f62-9135-1ed986b68311', 'feeling-unwell', 'Feeling Unwell', 'Talk about symptoms and give advice using should/shouldn''t.', 'A2', 'vocabulary', 1, 15, 'published'),
('7882afaf-acff-420f-b810-036a8ccc74c7', '68360c4b-9488-4f62-9135-1ed986b68311', 'healthy-habits', 'Healthy Habits', 'Describe habits and routines using frequency adverbs (always, often, sometimes, rarely, never).', 'A2', 'grammar', 2, 15, 'published'),
('ca9368ac-cc78-4c1d-81c4-00c9dfca7854', '68360c4b-9488-4f62-9135-1ed986b68311', 'at-the-doctors', 'At the Doctor''s', 'Describe symptoms and understand a doctor''s questions.', 'A2', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('6d21d61a-ea61-490b-93d2-f64be4acac0a', 'reading_passage', 'Tom has a headache and a sore throat today. He feels very tired and thinks he has a cold. His friend says, "You should drink lots of water and rest. You shouldn''t go to work today."', 1),
('7882afaf-acff-420f-b810-036a8ccc74c7', 'reading_passage', 'Sofia usually eats vegetables with every meal. She often walks to work instead of driving. She sometimes goes to the gym, but she never smokes and rarely eats fast food.', 1),
('ca9368ac-cc78-4c1d-81c4-00c9dfca7854', 'transcript', 'Doctor: What''s the problem?
Patient: I have a stomachache and I feel dizzy.
Doctor: How long have you had these symptoms?
Patient: Since yesterday morning.
Doctor: Okay, let''s take a look. Have you eaten anything unusual?
Patient: No, just my normal food.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('0fab0fff-613a-4849-97f3-369d2e11bff0', '6d21d61a-ea61-490b-93d2-f64be4acac0a', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('bf33a329-ec4c-4f29-8ec1-7c6558290ce3', '6d21d61a-ea61-490b-93d2-f64be4acac0a', 'speaking', 'speaking', 2, 'Describe how you feel today, or describe a time you were sick and what you did to feel better.', 5, 'published'),
('ddb3fbf0-fe10-4dd6-b7e7-9a9c5c7b2f76', '7882afaf-acff-420f-b810-036a8ccc74c7', 'multiple_choice', 'grammar', 1, 'Answer the questions based on the text above.', 5, 'published'),
('490b27e4-d453-4945-ba8c-96220a1d9d4d', '7882afaf-acff-420f-b810-036a8ccc74c7', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('f219ee30-b1f9-4ba0-bd42-a56a4fbdb5fa', 'ca9368ac-cc78-4c1d-81c4-00c9dfca7854', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the conversation above.', 5, 'published'),
('e43000fc-eaae-4ddb-ac6e-0caec0a8a42d', 'ca9368ac-cc78-4c1d-81c4-00c9dfca7854', 'writing', 'writing', 2, 'Write a short dialogue (4-6 lines) between a patient and a doctor describing symptoms.', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('35c4d996-f5e4-4d31-b865-f019b4db3f36', '0fab0fff-613a-4849-97f3-369d2e11bff0', 'What symptoms does Tom have?', 'multiple_choice', 1),
('33d7fe0a-a2cd-4cc5-bc47-47e24064ba0e', '0fab0fff-613a-4849-97f3-369d2e11bff0', 'His friend says he ___ drink lots of water.', 'multiple_choice', 2),
('ea6dc842-4803-4708-915f-b3e0d7ca2681', '0fab0fff-613a-4849-97f3-369d2e11bff0', 'True or false: Tom''s friend thinks he should go to work today.', 'true_false', 3),
('2d17a5ba-d098-4759-bcb7-ecdb711f7044', 'ddb3fbf0-fe10-4dd6-b7e7-9a9c5c7b2f76', 'How often does Sofia eat vegetables?', 'multiple_choice', 1),
('a721d24e-3097-4823-bc7b-bddcf341f383', 'ddb3fbf0-fe10-4dd6-b7e7-9a9c5c7b2f76', 'Which word means "not ever"?', 'multiple_choice', 2),
('74dff580-7f98-40b3-b11d-b59e8174cb12', 'ddb3fbf0-fe10-4dd6-b7e7-9a9c5c7b2f76', 'True or false: Sofia often eats fast food.', 'true_false', 3),
('532f0a0f-a3d0-484f-8104-29e75a48e2e6', '490b27e4-d453-4945-ba8c-96220a1d9d4d', 'She ___ walks to work instead of driving (this happens frequently, but not always).', 'fill_blank', 1),
('168ea5f4-877e-4ca1-9c6a-e6a9e8796af7', 'f219ee30-b1f9-4ba0-bd42-a56a4fbdb5fa', 'What are the patient''s symptoms?', 'multiple_choice', 1),
('d0037184-a69a-4291-8294-d17584dbedc3', 'f219ee30-b1f9-4ba0-bd42-a56a4fbdb5fa', 'Since when has the patient had these symptoms?', 'multiple_choice', 2),
('0d2a7aab-cc9f-4421-b57a-f1f499ceddda', 'f219ee30-b1f9-4ba0-bd42-a56a4fbdb5fa', 'True or false: the patient ate something unusual.', 'true_false', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('35c4d996-f5e4-4d31-b865-f019b4db3f36', 'A headache and a sore throat', true, 1),
('35c4d996-f5e4-4d31-b865-f019b4db3f36', 'A broken arm', false, 2),
('35c4d996-f5e4-4d31-b865-f019b4db3f36', 'A toothache', false, 3),
('33d7fe0a-a2cd-4cc5-bc47-47e24064ba0e', 'should', true, 1),
('33d7fe0a-a2cd-4cc5-bc47-47e24064ba0e', 'shouldn''t', false, 2),
('33d7fe0a-a2cd-4cc5-bc47-47e24064ba0e', 'must not', false, 3),
('ea6dc842-4803-4708-915f-b3e0d7ca2681', 'True', false, 1),
('ea6dc842-4803-4708-915f-b3e0d7ca2681', 'False', true, 2),
('2d17a5ba-d098-4759-bcb7-ecdb711f7044', 'Never', false, 1),
('2d17a5ba-d098-4759-bcb7-ecdb711f7044', 'With every meal', true, 2),
('2d17a5ba-d098-4759-bcb7-ecdb711f7044', 'Once a month', false, 3),
('a721d24e-3097-4823-bc7b-bddcf341f383', 'always', false, 1),
('a721d24e-3097-4823-bc7b-bddcf341f383', 'never', true, 2),
('a721d24e-3097-4823-bc7b-bddcf341f383', 'sometimes', false, 3),
('74dff580-7f98-40b3-b11d-b59e8174cb12', 'True', false, 1),
('74dff580-7f98-40b3-b11d-b59e8174cb12', 'False', true, 2),
('532f0a0f-a3d0-484f-8104-29e75a48e2e6', 'often', true, 1),
('168ea5f4-877e-4ca1-9c6a-e6a9e8796af7', 'A stomachache and feeling dizzy', true, 1),
('168ea5f4-877e-4ca1-9c6a-e6a9e8796af7', 'A cough and a fever', false, 2),
('168ea5f4-877e-4ca1-9c6a-e6a9e8796af7', 'A rash', false, 3),
('d0037184-a69a-4291-8294-d17584dbedc3', 'Since this morning', false, 1),
('d0037184-a69a-4291-8294-d17584dbedc3', 'Since yesterday morning', true, 2),
('d0037184-a69a-4291-8294-d17584dbedc3', 'Since last week', false, 3),
('0d2a7aab-cc9f-4421-b57a-f1f499ceddda', 'True', false, 1),
('0d2a7aab-cc9f-4421-b57a-f1f499ceddda', 'False', true, 2);

