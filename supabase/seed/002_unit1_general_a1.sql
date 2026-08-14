-- Unit 1 (General track, A1): "Getting Started"
-- Three original lessons -- Introducing Yourself, Daily Routines, Family and
-- Friends -- covering grammar, vocabulary, reading comprehension, speaking,
-- and writing. All text is original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after the schema migrations and the
-- placement seed. Not idempotent -- re-running creates duplicates.

insert into public.courses (id, slug, title, description, status) values
('b5e64615-e464-417f-bae9-aae536b8f416', 'general-english', 'General English', 'A general-purpose English course for learners at any level.', 'published');

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('f6506a4d-2713-4e13-804e-dd7e00324528', 'b5e64615-e464-417f-bae9-aae536b8f416', 'getting-started', 'Getting Started', 'The basics: introducing yourself, daily routines, and talking about family.', 'general', 1, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('525faf67-bab4-4ee3-bc91-0379138fa028', 'f6506a4d-2713-4e13-804e-dd7e00324528', 'introducing-yourself', 'Introducing Yourself', 'Learn to introduce yourself: name, origin, and occupation, using the verb "to be".', 'A1', 'grammar', 1, 15, 'published'),
('9e5bd729-59a2-470f-ae63-c7d05abaaf95', 'f6506a4d-2713-4e13-804e-dd7e00324528', 'daily-routines', 'Daily Routines', 'Talk about everyday habits and routines using the present simple.', 'A1', 'grammar', 2, 15, 'published'),
('b8c79168-3096-4108-b6b9-b5a2e9cba1d9', 'f6506a4d-2713-4e13-804e-dd7e00324528', 'family-and-friends', 'Family and Friends', 'Describe your family using common family vocabulary and possessives.', 'A1', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('525faf67-bab4-4ee3-bc91-0379138fa028', 'reading_passage', 'Hi, my name is Carla. I am from Brazil. I am a teacher. I am thirty-two years old. Nice to meet you!', 1),
('9e5bd729-59a2-470f-ae63-c7d05abaaf95', 'reading_passage', 'Every day, Marco wakes up at seven o''clock. He has breakfast at seven thirty. He goes to work at eight. He works from nine to five. In the evening, he cooks dinner and watches TV. He goes to bed at eleven.', 1),
('b8c79168-3096-4108-b6b9-b5a2e9cba1d9', 'reading_passage', 'This is my family. My father''s name is Pedro. My mother''s name is Sofia. I have one brother and one sister. My brother is older than me, and my sister is younger. We live together in a small house.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('3911dd98-4b23-41eb-a381-e35d4e3d9459', '525faf67-bab4-4ee3-bc91-0379138fa028', 'multiple_choice', 'grammar', 1, 'Choose the correct form of the verb "to be", or answer true or false about the text above.', 5, 'published'),
('e983e4ca-5a58-47ed-b189-0e93527054e2', '525faf67-bab4-4ee3-bc91-0379138fa028', 'speaking', 'speaking', 2, 'Introduce yourself out loud: say your name, where you are from, and your job.', 5, 'published'),
('2b0e303a-0a6f-4547-a51e-6dc399d70069', '9e5bd729-59a2-470f-ae63-c7d05abaaf95', 'multiple_choice', 'grammar', 1, 'Choose the correct present simple form, based on the text above.', 5, 'published'),
('d0b4c9c6-fbdf-4883-a8e9-f96d461580e9', '9e5bd729-59a2-470f-ae63-c7d05abaaf95', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('dc31e245-93ba-460a-8d5a-1c87fbaedb91', 'b8c79168-3096-4108-b6b9-b5a2e9cba1d9', 'multiple_choice', 'vocabulary', 1, 'Choose the correct family word, or answer true or false about the text above.', 5, 'published'),
('469a3246-54f4-44a7-afb8-61bd16b321b8', 'b8c79168-3096-4108-b6b9-b5a2e9cba1d9', 'writing', 'writing', 2, 'Write a short paragraph (3-5 sentences) describing your own family.', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('cfb7a42d-5475-482d-bf6d-bebbaad96e0c', '3911dd98-4b23-41eb-a381-e35d4e3d9459', 'I ___ a teacher.', 'multiple_choice', 1),
('aae2a588-64c0-4b45-af5e-574d23084c8b', '3911dd98-4b23-41eb-a381-e35d4e3d9459', 'She ___ from Brazil.', 'multiple_choice', 2),
('4aff8df4-973e-42f6-9282-4fca82fe1528', '3911dd98-4b23-41eb-a381-e35d4e3d9459', 'They ___ students.', 'multiple_choice', 3),
('68423b93-2590-4f1e-bf99-029cef0b0325', '3911dd98-4b23-41eb-a381-e35d4e3d9459', 'True or false: Carla is a teacher.', 'true_false', 4),
('2d9273da-04c4-408a-b909-8c4765653498', '2b0e303a-0a6f-4547-a51e-6dc399d70069', 'Marco ___ up at seven o''clock.', 'multiple_choice', 1),
('f0da51a4-eaf8-498a-aa7b-edd121cc5543', '2b0e303a-0a6f-4547-a51e-6dc399d70069', 'He ___ breakfast at seven thirty.', 'multiple_choice', 2),
('7054864d-121f-4cb0-9286-02939e8a9d23', '2b0e303a-0a6f-4547-a51e-6dc399d70069', 'He ___ to work at eight.', 'multiple_choice', 3),
('f4a63efc-2045-4105-800f-375fccb2c5eb', '2b0e303a-0a6f-4547-a51e-6dc399d70069', 'True or false: Marco cooks dinner in the morning.', 'true_false', 4),
('585e6cd4-f959-4de9-9bde-20a3642060c7', 'dc31e245-93ba-460a-8d5a-1c87fbaedb91', 'My father''s brother is my ___.', 'multiple_choice', 1),
('4cacf8fc-d72c-43be-b81f-dfc7849f0699', 'dc31e245-93ba-460a-8d5a-1c87fbaedb91', 'My mother''s mother is my ___.', 'multiple_choice', 2),
('c25bfa90-9921-4871-ac60-54f70855b6ca', 'dc31e245-93ba-460a-8d5a-1c87fbaedb91', 'True or false: the writer has two brothers.', 'true_false', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('cfb7a42d-5475-482d-bf6d-bebbaad96e0c', 'am', true, 1),
('cfb7a42d-5475-482d-bf6d-bebbaad96e0c', 'is', false, 2),
('cfb7a42d-5475-482d-bf6d-bebbaad96e0c', 'are', false, 3),
('aae2a588-64c0-4b45-af5e-574d23084c8b', 'am', false, 1),
('aae2a588-64c0-4b45-af5e-574d23084c8b', 'is', true, 2),
('aae2a588-64c0-4b45-af5e-574d23084c8b', 'are', false, 3),
('4aff8df4-973e-42f6-9282-4fca82fe1528', 'am', false, 1),
('4aff8df4-973e-42f6-9282-4fca82fe1528', 'is', false, 2),
('4aff8df4-973e-42f6-9282-4fca82fe1528', 'are', true, 3),
('68423b93-2590-4f1e-bf99-029cef0b0325', 'True', true, 1),
('68423b93-2590-4f1e-bf99-029cef0b0325', 'False', false, 2),
('2d9273da-04c4-408a-b909-8c4765653498', 'wake', false, 1),
('2d9273da-04c4-408a-b909-8c4765653498', 'wakes', true, 2),
('2d9273da-04c4-408a-b909-8c4765653498', 'waking', false, 3),
('f0da51a4-eaf8-498a-aa7b-edd121cc5543', 'have', false, 1),
('f0da51a4-eaf8-498a-aa7b-edd121cc5543', 'has', true, 2),
('f0da51a4-eaf8-498a-aa7b-edd121cc5543', 'having', false, 3),
('7054864d-121f-4cb0-9286-02939e8a9d23', 'go', false, 1),
('7054864d-121f-4cb0-9286-02939e8a9d23', 'goes', true, 2),
('7054864d-121f-4cb0-9286-02939e8a9d23', 'going', false, 3),
('f4a63efc-2045-4105-800f-375fccb2c5eb', 'True', false, 1),
('f4a63efc-2045-4105-800f-375fccb2c5eb', 'False', true, 2),
('585e6cd4-f959-4de9-9bde-20a3642060c7', 'uncle', true, 1),
('585e6cd4-f959-4de9-9bde-20a3642060c7', 'cousin', false, 2),
('585e6cd4-f959-4de9-9bde-20a3642060c7', 'nephew', false, 3),
('4cacf8fc-d72c-43be-b81f-dfc7849f0699', 'aunt', false, 1),
('4cacf8fc-d72c-43be-b81f-dfc7849f0699', 'grandmother', true, 2),
('4cacf8fc-d72c-43be-b81f-dfc7849f0699', 'sister', false, 3),
('c25bfa90-9921-4871-ac60-54f70855b6ca', 'True', false, 1),
('c25bfa90-9921-4871-ac60-54f70855b6ca', 'False', true, 2);

insert into public.questions (id, activity_id, prompt, type, order_index) values
('b99f9ed1-9c4f-4c3a-b282-2c5171625c04', 'd0b4c9c6-fbdf-4883-a8e9-f96d461580e9', 'I brush my ___ every morning.', 'fill_blank', 1);

insert into public.question_options (question_id, text, is_correct, order_index) values
('b99f9ed1-9c4f-4c3a-b282-2c5171625c04', 'teeth', true, 1);

