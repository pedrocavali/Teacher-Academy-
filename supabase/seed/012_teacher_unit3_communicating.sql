-- Teachers track, Unit 3 (B1-B2): "Communicating with Parents and Colleagues"
-- Three original lessons -- Parent-Teacher Meetings, Professional Emails
-- for Teachers, Staff Meetings and Collaboration -- covering progress
-- discussions, formal email writing, and staff-meeting vocabulary. All
-- text is original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after 001-009 and 010-011 have
-- been applied (010 creates the "english-for-teachers" course). Not
-- idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('77dcf4d2-5599-4dea-8600-af8f838cd201', (select id from public.courses where slug = 'english-for-teachers'), 'communicating-with-parents-and-colleagues', 'Communicating with Parents and Colleagues', 'Parent meetings, professional emails, and staff collaboration -- the English of school life beyond the classroom.', 'teachers', 3, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('90fa6d98-f2b9-4268-82b6-a66639bf6624', '77dcf4d2-5599-4dea-8600-af8f838cd201', 'parent-teacher-meetings', 'Parent-Teacher Meetings', 'Discuss a student''s progress politely and constructively with a parent.', 'B1', 'vocabulary', 1, 15, 'published'),
('5ed34b0a-a7ef-4e99-933e-30879fe20ace', '77dcf4d2-5599-4dea-8600-af8f838cd201', 'professional-emails-for-teachers', 'Professional Emails for Teachers', 'Write clear, formal emails to parents and school contacts.', 'B2', 'writing', 2, 15, 'published'),
('ebf9046a-96e2-422c-84c5-534e4b45ddcb', '77dcf4d2-5599-4dea-8600-af8f838cd201', 'staff-meetings-and-collaboration', 'Staff Meetings and Collaboration', 'Discuss curriculum and collaboration using common staff-meeting vocabulary.', 'B2', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('90fa6d98-f2b9-4268-82b6-a66639bf6624', 'transcript', 'Teacher: Thank you for coming in today. I''d like to talk about Maria''s progress. She''s doing very well in reading, but she could improve her participation in group work.
Parent: Thank you for letting me know. What can we do at home to help?
Teacher: Encouraging her to share her ideas with family members would be a great start.', 1),
('5ed34b0a-a7ef-4e99-933e-30879fe20ace', 'reading_passage', '"Dear Mr. Alves, I am writing to inform you that the school trip has been rescheduled to next Friday. Please let me know if this date works for your family. Best regards, Ms. Costa"', 1),
('ebf9046a-96e2-422c-84c5-534e4b45ddcb', 'reading_passage', 'During staff meetings, teachers often discuss the curriculum, share resources, and plan professional development. Collaboration between colleagues helps improve teaching practice across the whole school.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('9aae6785-7a1c-496e-ac13-4048b959c417', '90fa6d98-f2b9-4268-82b6-a66639bf6624', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the conversation above.', 5, 'published'),
('9fb0aae1-1713-4d1a-afb8-05a1478f67ff', '90fa6d98-f2b9-4268-82b6-a66639bf6624', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('3f7c53b4-dbc1-44ef-941a-932b5b3a4708', '90fa6d98-f2b9-4268-82b6-a66639bf6624', 'speaking', 'speaking', 3, 'Practice starting a parent-teacher conversation: greet the parent and mention one strength and one area for improvement.', 5, 'published'),
('75f68f17-cfb6-4970-b4a1-8c28fe030fa0', '5ed34b0a-a7ef-4e99-933e-30879fe20ace', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the email above.', 5, 'published'),
('e3c7417d-329d-4fad-95f4-0fd21bc785b3', '5ed34b0a-a7ef-4e99-933e-30879fe20ace', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('74438661-522f-4bc3-bb0b-cfe2430a8779', '5ed34b0a-a7ef-4e99-933e-30879fe20ace', 'writing', 'writing', 3, 'Write a short, formal email (4-5 sentences) to a parent about an upcoming school event.', 10, 'published'),
('0cbf643e-4493-47a7-a72d-10b114815287', 'ebf9046a-96e2-422c-84c5-534e4b45ddcb', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('c3600666-d897-4a4e-8fdc-5beff45b93e8', 'ebf9046a-96e2-422c-84c5-534e4b45ddcb', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('be446bff-eb64-4853-874e-876afa71a563', 'ebf9046a-96e2-422c-84c5-534e4b45ddcb', 'speaking', 'speaking', 3, 'Share one idea you would bring to a staff meeting to improve collaboration among teachers.', 5, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('70c7583d-d71c-432c-a3ab-402380cb545b', '9aae6785-7a1c-496e-ac13-4048b959c417', 'What is Maria doing well in?', 'multiple_choice', 1),
('08ed9ecd-bc6c-47be-ae53-c8c4f855af6b', '9aae6785-7a1c-496e-ac13-4048b959c417', 'What does the teacher suggest Maria improve?', 'multiple_choice', 2),
('514fdede-1594-474c-adb2-fff17105bf91', '9aae6785-7a1c-496e-ac13-4048b959c417', 'True or false: the teacher only talks about problems, not strengths.', 'true_false', 3),
('290579fe-3d38-4fcb-a27d-9be9eb77f718', '9fb0aae1-1713-4d1a-afb8-05a1478f67ff', '"I''d like to ___ about your child''s progress." (polite way to start a topic)', 'fill_blank', 1),
('6d151860-e543-45b6-b5c8-189fd7abb412', '75f68f17-cfb6-4970-b4a1-8c28fe030fa0', '"I am writing to inform you..." is used to...', 'multiple_choice', 1),
('36317c49-e65b-4fb8-a41e-5fbab495c239', '75f68f17-cfb6-4970-b4a1-8c28fe030fa0', '"Best regards" is an example of a...', 'multiple_choice', 2),
('04379ddc-6aff-4560-a4ad-a4e538c16563', '75f68f17-cfb6-4970-b4a1-8c28fe030fa0', 'True or false: the email is written in an informal, casual tone.', 'true_false', 3),
('ae8449d7-38e0-41ee-a498-1bf2883cb0ad', 'e3c7417d-329d-4fad-95f4-0fd21bc785b3', '"Please ___ me know if this works." (polite request for a reply)', 'fill_blank', 1),
('af780a30-92ba-4674-98a1-b4fcb6412a8e', '0cbf643e-4493-47a7-a72d-10b114815287', 'What do teachers often share during staff meetings?', 'multiple_choice', 1),
('cc74dd23-9d2d-4153-ad8a-10e062ebf777', '0cbf643e-4493-47a7-a72d-10b114815287', 'What does "professional development" refer to?', 'multiple_choice', 2),
('11103038-2a24-48bc-b17f-a805c26b8288', '0cbf643e-4493-47a7-a72d-10b114815287', 'True or false: collaboration only benefits individual teachers, not the school.', 'true_false', 3),
('33253359-47d6-4a5e-9322-3c8f3a5ed5f0', 'c3600666-d897-4a4e-8fdc-5beff45b93e8', 'The set of subjects and content taught in a school is called the ___.', 'fill_blank', 1);

insert into public.question_options (question_id, text, is_correct, order_index) values
('70c7583d-d71c-432c-a3ab-402380cb545b', 'Group work', false, 1),
('70c7583d-d71c-432c-a3ab-402380cb545b', 'Reading', true, 2),
('70c7583d-d71c-432c-a3ab-402380cb545b', 'Math', false, 3),
('08ed9ecd-bc6c-47be-ae53-c8c4f855af6b', 'Reading', false, 1),
('08ed9ecd-bc6c-47be-ae53-c8c4f855af6b', 'Participation in group work', true, 2),
('08ed9ecd-bc6c-47be-ae53-c8c4f855af6b', 'Homework', false, 3),
('514fdede-1594-474c-adb2-fff17105bf91', 'True', false, 1),
('514fdede-1594-474c-adb2-fff17105bf91', 'False', true, 2),
('290579fe-3d38-4fcb-a27d-9be9eb77f718', 'talk', true, 1),
('6d151860-e543-45b6-b5c8-189fd7abb412', 'ask a question', false, 1),
('6d151860-e543-45b6-b5c8-189fd7abb412', 'announce information', true, 2),
('6d151860-e543-45b6-b5c8-189fd7abb412', 'apologize', false, 3),
('36317c49-e65b-4fb8-a41e-5fbab495c239', 'formal closing', true, 1),
('36317c49-e65b-4fb8-a41e-5fbab495c239', 'informal closing', false, 2),
('36317c49-e65b-4fb8-a41e-5fbab495c239', 'greeting', false, 3),
('04379ddc-6aff-4560-a4ad-a4e538c16563', 'True', false, 1),
('04379ddc-6aff-4560-a4ad-a4e538c16563', 'False', true, 2),
('ae8449d7-38e0-41ee-a498-1bf2883cb0ad', 'let', true, 1),
('af780a30-92ba-4674-98a1-b4fcb6412a8e', 'Personal problems', false, 1),
('af780a30-92ba-4674-98a1-b4fcb6412a8e', 'Resources', true, 2),
('af780a30-92ba-4674-98a1-b4fcb6412a8e', 'Test scores only', false, 3),
('cc74dd23-9d2d-4153-ad8a-10e062ebf777', 'Growing your teaching skills', true, 1),
('cc74dd23-9d2d-4153-ad8a-10e062ebf777', 'Getting paid more', false, 2),
('cc74dd23-9d2d-4153-ad8a-10e062ebf777', 'Taking a vacation', false, 3),
('11103038-2a24-48bc-b17f-a805c26b8288', 'True', false, 1),
('11103038-2a24-48bc-b17f-a805c26b8288', 'False', true, 2),
('33253359-47d6-4a5e-9322-3c8f3a5ed5f0', 'curriculum', true, 1);

