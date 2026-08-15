-- Teachers track, Unit 1 (A2-B1): "Classroom Language"
-- Three original lessons -- Giving Instructions, Classroom Objects and
-- Routines, Managing Behavior -- covering imperatives, classroom
-- vocabulary, and behavior-management phrases. All text is original,
-- written for this platform.
--
-- Run once in the Supabase SQL Editor, after supabase/seed/001-009 have
-- been applied. Creates the "english-for-teachers" course. Not idempotent.

insert into public.courses (id, slug, title, description, status) values
('48342481-44c4-4d02-8d4f-921f065f3cec', 'english-for-teachers', 'English for Teachers', 'Classroom language, lesson planning, and professional communication for teachers.', 'published');

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('fba08262-0b13-4fc8-b137-717799851e83', '48342481-44c4-4d02-8d4f-921f065f3cec', 'classroom-language', 'Classroom Language', 'Instructions, routines, and behavior management -- the English you use every day in the classroom.', 'teachers', 1, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('42d369dc-2f3b-42e5-b8eb-93b8604aff19', 'fba08262-0b13-4fc8-b137-717799851e83', 'giving-instructions', 'Giving Instructions', 'Give clear classroom instructions using imperatives.', 'A2', 'grammar', 1, 15, 'published'),
('2b4748ad-0c0c-41e3-b1aa-f3df8c6ec182', 'fba08262-0b13-4fc8-b137-717799851e83', 'classroom-objects-and-routines', 'Classroom Objects and Routines', 'Describe everyday classroom objects and routines.', 'A2', 'vocabulary', 2, 15, 'published'),
('29c951c0-8061-4071-9fe1-eb614651bfcf', 'fba08262-0b13-4fc8-b137-717799851e83', 'managing-behavior', 'Managing Behavior', 'Use polite, effective language to manage classroom behavior.', 'B1', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('42d369dc-2f3b-42e5-b8eb-93b8604aff19', 'reading_passage', 'On the first day of class, Mrs. Silva says: "Good morning, everyone! Please take a seat. Open your books to page ten. Take out a pencil, and don''t forget your notebooks. Let''s begin!"', 1),
('2b4748ad-0c0c-41e3-b1aa-f3df8c6ec182', 'reading_passage', 'Every morning, the teacher takes roll call and writes the date on the whiteboard. Students check the homework on the board, then get out their worksheets. At the end of class, the teacher collects the worksheets and erases the whiteboard.', 1),
('29c951c0-8061-4071-9fe1-eb614651bfcf', 'reading_passage', '"Great job, everyone! Let''s keep that energy for the next activity." "I understand this is difficult, but please try again." "Can I have your attention, please? Let''s lower our voices."', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('2a4a8367-edc5-4df4-8aa9-2cd6eba14a1c', '42d369dc-2f3b-42e5-b8eb-93b8604aff19', 'multiple_choice', 'grammar', 1, 'Answer the questions based on the text above.', 5, 'published'),
('85666046-6efa-4b36-8841-cb4176eeb4ef', '42d369dc-2f3b-42e5-b8eb-93b8604aff19', 'ordering', 'vocabulary', 2, 'Put the words in the correct order.', 3, 'published'),
('ad6d5ca8-7e0f-4da8-9183-618109ee0734', '42d369dc-2f3b-42e5-b8eb-93b8604aff19', 'speaking', 'speaking', 3, 'Give three classroom instructions out loud, as if you were a teacher starting a lesson.', 5, 'published'),
('b0025897-2391-4561-9134-ad88d848e143', '2b4748ad-0c0c-41e3-b1aa-f3df8c6ec182', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('c9339ab8-a432-4656-a4b7-8c617c15f120', '2b4748ad-0c0c-41e3-b1aa-f3df8c6ec182', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('95cfb189-7975-43b9-98db-5bbdcd6a8cdc', '2b4748ad-0c0c-41e3-b1aa-f3df8c6ec182', 'writing', 'writing', 3, 'Write 3-4 sentences describing your own classroom routine at the start of a lesson.', 10, 'published'),
('e150327e-6934-445b-94c3-7d4da9846bca', '29c951c0-8061-4071-9fe1-eb614651bfcf', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('d2a89b0f-d9c6-48e4-a965-888e40ae9cca', '29c951c0-8061-4071-9fe1-eb614651bfcf', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('10bdf6e4-fa84-43f8-a30d-1d3dd1a0747b', '29c951c0-8061-4071-9fe1-eb614651bfcf', 'speaking', 'speaking', 3, 'Practice saying two classroom management phrases: one to praise a student, and one to redirect behavior politely.', 5, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('78ad8a6f-45f4-418b-bb4b-36a8124e4f61', '2a4a8367-edc5-4df4-8aa9-2cd6eba14a1c', '"___ your books to page ten."', 'multiple_choice', 1),
('eba4faca-f254-4168-b971-c52cd78ea4b2', '2a4a8367-edc5-4df4-8aa9-2cd6eba14a1c', '"___ forget your notebooks."', 'multiple_choice', 2),
('badad622-6084-4a76-bcac-daa257133ca6', '2a4a8367-edc5-4df4-8aa9-2cd6eba14a1c', 'True or false: Mrs. Silva asks the students to stand up.', 'true_false', 3),
('194344a5-8277-46f2-a1bf-d12d3d98b060', '85666046-6efa-4b36-8841-cb4176eeb4ef', 'Put in order: seat. / a / take / Please', 'ordering', 1),
('12a34320-bb3a-4b73-b640-24a3155fca22', 'b0025897-2391-4561-9134-ad88d848e143', 'What does the teacher do first every morning?', 'multiple_choice', 1),
('853b49ed-2974-4fe5-b7b0-7eccfc62448c', 'b0025897-2391-4561-9134-ad88d848e143', 'Where does the teacher write the date?', 'multiple_choice', 2),
('3a1bad0e-86db-4452-814b-1ba439ed76e5', 'b0025897-2391-4561-9134-ad88d848e143', 'True or false: students check homework on the board.', 'true_false', 3),
('52fc3b4f-b796-44ae-9207-7f44059918ae', 'c9339ab8-a432-4656-a4b7-8c617c15f120', 'A piece of paper with exercises for students to complete is called a ___.', 'fill_blank', 1),
('5b0d5f13-fbb3-4046-ba32-bd7a49ea76cc', 'e150327e-6934-445b-94c3-7d4da9846bca', '"Let''s lower our voices" is used when students are...', 'multiple_choice', 1),
('56cbf4dd-442f-451a-bfb7-ed3e8b645517', 'e150327e-6934-445b-94c3-7d4da9846bca', '"Please try again" is an example of...', 'multiple_choice', 2),
('bb1bb273-aa05-4d8b-af1b-d86a26ad08da', 'e150327e-6934-445b-94c3-7d4da9846bca', 'True or false: the teacher only uses negative language to manage the classroom.', 'true_false', 3),
('ea12f536-8652-4474-9e85-17f21e8b51aa', 'd2a89b0f-d9c6-48e4-a965-888e40ae9cca', '"Can I have your ___, please?" (asking students to focus)', 'fill_blank', 1);

insert into public.question_options (question_id, text, is_correct, order_index) values
('78ad8a6f-45f4-418b-bb4b-36a8124e4f61', 'Open', true, 1),
('78ad8a6f-45f4-418b-bb4b-36a8124e4f61', 'Opens', false, 2),
('78ad8a6f-45f4-418b-bb4b-36a8124e4f61', 'Opening', false, 3),
('eba4faca-f254-4168-b971-c52cd78ea4b2', 'Don''t', true, 1),
('eba4faca-f254-4168-b971-c52cd78ea4b2', 'Doesn''t', false, 2),
('eba4faca-f254-4168-b971-c52cd78ea4b2', 'Not', false, 3),
('badad622-6084-4a76-bcac-daa257133ca6', 'True', false, 1),
('badad622-6084-4a76-bcac-daa257133ca6', 'False', true, 2),
('194344a5-8277-46f2-a1bf-d12d3d98b060', 'Please', false, 1),
('194344a5-8277-46f2-a1bf-d12d3d98b060', 'take', false, 2),
('194344a5-8277-46f2-a1bf-d12d3d98b060', 'a', false, 3),
('194344a5-8277-46f2-a1bf-d12d3d98b060', 'seat.', false, 4),
('12a34320-bb3a-4b73-b640-24a3155fca22', 'Erase the whiteboard', false, 1),
('12a34320-bb3a-4b73-b640-24a3155fca22', 'Take roll call', true, 2),
('12a34320-bb3a-4b73-b640-24a3155fca22', 'Collect worksheets', false, 3),
('853b49ed-2974-4fe5-b7b0-7eccfc62448c', 'In a notebook', false, 1),
('853b49ed-2974-4fe5-b7b0-7eccfc62448c', 'On the whiteboard', true, 2),
('853b49ed-2974-4fe5-b7b0-7eccfc62448c', 'On a worksheet', false, 3),
('3a1bad0e-86db-4452-814b-1ba439ed76e5', 'True', true, 1),
('3a1bad0e-86db-4452-814b-1ba439ed76e5', 'False', false, 2),
('52fc3b4f-b796-44ae-9207-7f44059918ae', 'worksheet', true, 1),
('5b0d5f13-fbb3-4046-ba32-bd7a49ea76cc', 'too quiet', false, 1),
('5b0d5f13-fbb3-4046-ba32-bd7a49ea76cc', 'too loud', true, 2),
('5b0d5f13-fbb3-4046-ba32-bd7a49ea76cc', 'too slow', false, 3),
('56cbf4dd-442f-451a-bfb7-ed3e8b645517', 'criticism', false, 1),
('56cbf4dd-442f-451a-bfb7-ed3e8b645517', 'encouragement', true, 2),
('56cbf4dd-442f-451a-bfb7-ed3e8b645517', 'a warning', false, 3),
('bb1bb273-aa05-4d8b-af1b-d86a26ad08da', 'True', false, 1),
('bb1bb273-aa05-4d8b-af1b-d86a26ad08da', 'False', true, 2),
('ea12f536-8652-4474-9e85-17f21e8b51aa', 'attention', true, 1);

