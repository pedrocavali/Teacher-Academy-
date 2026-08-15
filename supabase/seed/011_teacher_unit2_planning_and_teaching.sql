-- Teachers track, Unit 2 (B1-B2): "Planning and Teaching"
-- Three original lessons -- Lesson Planning Vocabulary, Explaining
-- Grammar to Students, Giving Feedback -- covering lesson-plan stages,
-- clarifying language, and constructive feedback phrases. All text is
-- original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after 001-009 and 010 have been
-- applied (010 creates the "english-for-teachers" course). Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('8c483641-76ee-4ace-98ae-bd95b5753312', (select id from public.courses where slug = 'english-for-teachers'), 'planning-and-teaching', 'Planning and Teaching', 'Lesson-plan vocabulary, explaining grammar, and giving feedback -- the craft of teaching in English.', 'teachers', 2, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('3edf2c57-5cdc-4e24-b8b8-e35f7a826afc', '8c483641-76ee-4ace-98ae-bd95b5753312', 'lesson-planning-vocabulary', 'Lesson Planning Vocabulary', 'Use core vocabulary for describing the stages of a lesson plan.', 'B1', 'vocabulary', 1, 15, 'published'),
('37445684-4187-49d2-9b7f-bebc9a3a49d6', '8c483641-76ee-4ace-98ae-bd95b5753312', 'explaining-grammar-to-students', 'Explaining Grammar to Students', 'Use clarifying phrases to explain grammar rules clearly.', 'B2', 'vocabulary', 2, 15, 'published'),
('5dee328c-267e-4393-9341-1f973c49fe8f', '8c483641-76ee-4ace-98ae-bd95b5753312', 'giving-feedback', 'Giving Feedback', 'Give specific, balanced feedback using the "sandwich" method.', 'B2', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('3edf2c57-5cdc-4e24-b8b8-e35f7a826afc', 'reading_passage', 'A typical lesson plan has a warm-up to engage students, a presentation stage to introduce new language, guided practice, and a wrap-up to review the main objective. Teachers often include an assessment to check understanding.', 1),
('37445684-4187-49d2-9b7f-bebc9a3a49d6', 'reading_passage', 'When explaining grammar, teachers often say: "In other words, this means..." or "For example, we can say..." to clarify a rule. Using simple examples helps students understand abstract concepts.', 1),
('5dee328c-267e-4393-9341-1f973c49fe8f', 'reading_passage', 'Good feedback is specific and balanced. Instead of just saying "good job," a teacher might say, "Your introduction was clear, but try to add more examples next time." This is often called the "sandwich" method: praise, then a suggestion, then encouragement.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('262b237b-e432-4705-98cf-4acfa4912ebf', '3edf2c57-5cdc-4e24-b8b8-e35f7a826afc', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('04a1cdf8-d7de-41f8-8129-d098749aae0b', '3edf2c57-5cdc-4e24-b8b8-e35f7a826afc', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('437fdd81-f8bd-4c52-ae5a-89f5764ae0d0', '3edf2c57-5cdc-4e24-b8b8-e35f7a826afc', 'writing', 'writing', 3, 'Write a short outline (3-4 sentences) of a lesson plan for a topic of your choice, using at least two of the vocabulary words above.', 10, 'published'),
('9e411309-d5b2-4258-b3b6-b9d0770d43d1', '37445684-4187-49d2-9b7f-bebc9a3a49d6', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('9aa9f89a-fc91-4dbf-ba94-3fff643bc3a6', '37445684-4187-49d2-9b7f-bebc9a3a49d6', 'fill_blank', 'grammar', 2, 'Complete the sentence with the missing word(s).', 3, 'published'),
('4d40cc68-e014-4ab0-8514-86b44611332d', '37445684-4187-49d2-9b7f-bebc9a3a49d6', 'speaking', 'speaking', 3, 'Explain a grammar rule (any rule you know well) to an imaginary student, using at least one clarifying phrase from this lesson.', 5, 'published'),
('0c3c67b6-65de-4745-80fe-27667f75d6c8', '5dee328c-267e-4393-9341-1f973c49fe8f', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the text above.', 5, 'published'),
('68052104-f047-45fa-b219-eeb29097d9a1', '5dee328c-267e-4393-9341-1f973c49fe8f', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('dcf6a9d2-dd98-4754-bf1d-4e7ec8c20864', '5dee328c-267e-4393-9341-1f973c49fe8f', 'writing', 'writing', 3, 'Write a short piece of feedback (3-4 sentences) for a student''s presentation, using the sandwich method.', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('2ab1a43f-03ab-473a-828f-a2f3b59b5e50', '262b237b-e432-4705-98cf-4acfa4912ebf', 'What is the purpose of a warm-up?', 'multiple_choice', 1),
('1854b42f-abc9-4496-9953-e2d75558537e', '262b237b-e432-4705-98cf-4acfa4912ebf', 'Which stage introduces new language?', 'multiple_choice', 2),
('20311b27-43e2-4a21-92b8-ba15b578f41e', '262b237b-e432-4705-98cf-4acfa4912ebf', 'True or false: a wrap-up happens at the beginning of a lesson.', 'true_false', 3),
('0a26cf05-66d6-424f-90c0-9758fdfbb240', '04a1cdf8-d7de-41f8-8129-d098749aae0b', 'The main goal of a lesson is called the lesson ___.', 'fill_blank', 1),
('5990402c-92a1-42b1-b081-e265c49e1510', '9e411309-d5b2-4258-b3b6-b9d0770d43d1', '"In other words..." is used to...', 'multiple_choice', 1),
('1e075daa-d552-4140-82e4-9d01db3cdcbe', '9e411309-d5b2-4258-b3b6-b9d0770d43d1', '"For example..." introduces...', 'multiple_choice', 2),
('4267a067-35fd-43d5-a2d0-cc4d06659c7d', '9e411309-d5b2-4258-b3b6-b9d0770d43d1', 'True or false: abstract concepts are always easier without examples.', 'true_false', 3),
('a1da4013-931d-471f-80ea-1a39ee4bcc9e', '9aa9f89a-fc91-4dbf-ba94-3fff643bc3a6', '"___ words, the present perfect connects the past and the present." (rephrasing phrase)', 'fill_blank', 1),
('cddd2853-6ae8-4227-91fa-7103f63ccbd7', '0c3c67b6-65de-4745-80fe-27667f75d6c8', 'What makes feedback more useful than just "good job"?', 'multiple_choice', 1),
('3efd6f48-a896-45b5-a6db-8d03898f7731', '0c3c67b6-65de-4745-80fe-27667f75d6c8', 'The "sandwich" method starts with...', 'multiple_choice', 2),
('33215672-c107-4847-bb4b-8946ee72ea43', '0c3c67b6-65de-4745-80fe-27667f75d6c8', 'True or false: the sandwich method only includes criticism.', 'true_false', 3),
('f874dfc1-9e1e-4119-8958-8b1ccea40838', '68052104-f047-45fa-b219-eeb29097d9a1', 'Feedback that points out what to improve is called a ___.', 'fill_blank', 1);

insert into public.question_options (question_id, text, is_correct, order_index) values
('2ab1a43f-03ab-473a-828f-a2f3b59b5e50', 'To test students', false, 1),
('2ab1a43f-03ab-473a-828f-a2f3b59b5e50', 'To engage students at the start', true, 2),
('2ab1a43f-03ab-473a-828f-a2f3b59b5e50', 'To end the lesson', false, 3),
('1854b42f-abc9-4496-9953-e2d75558537e', 'Wrap-up', false, 1),
('1854b42f-abc9-4496-9953-e2d75558537e', 'Presentation', true, 2),
('1854b42f-abc9-4496-9953-e2d75558537e', 'Warm-up', false, 3),
('20311b27-43e2-4a21-92b8-ba15b578f41e', 'True', false, 1),
('20311b27-43e2-4a21-92b8-ba15b578f41e', 'False', true, 2),
('0a26cf05-66d6-424f-90c0-9758fdfbb240', 'objective', true, 1),
('5990402c-92a1-42b1-b081-e265c49e1510', 'introduce an example', false, 1),
('5990402c-92a1-42b1-b081-e265c49e1510', 'rephrase an idea more simply', true, 2),
('5990402c-92a1-42b1-b081-e265c49e1510', 'end the explanation', false, 3),
('1e075daa-d552-4140-82e4-9d01db3cdcbe', 'a rule', false, 1),
('1e075daa-d552-4140-82e4-9d01db3cdcbe', 'a specific instance', true, 2),
('1e075daa-d552-4140-82e4-9d01db3cdcbe', 'a question', false, 3),
('4267a067-35fd-43d5-a2d0-cc4d06659c7d', 'True', false, 1),
('4267a067-35fd-43d5-a2d0-cc4d06659c7d', 'False', true, 2),
('a1da4013-931d-471f-80ea-1a39ee4bcc9e', 'In other', true, 1),
('cddd2853-6ae8-4227-91fa-7103f63ccbd7', 'Being vague', false, 1),
('cddd2853-6ae8-4227-91fa-7103f63ccbd7', 'Being specific', true, 2),
('cddd2853-6ae8-4227-91fa-7103f63ccbd7', 'Being short', false, 3),
('3efd6f48-a896-45b5-a6db-8d03898f7731', 'a suggestion', false, 1),
('3efd6f48-a896-45b5-a6db-8d03898f7731', 'praise', true, 2),
('3efd6f48-a896-45b5-a6db-8d03898f7731', 'a question', false, 3),
('33215672-c107-4847-bb4b-8946ee72ea43', 'True', false, 1),
('33215672-c107-4847-bb4b-8946ee72ea43', 'False', true, 2),
('f874dfc1-9e1e-4119-8958-8b1ccea40838', 'suggestion', true, 1);

