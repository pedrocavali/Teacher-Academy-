-- Unit 7 (General track, C2): "Mastering English"
-- Three original lessons -- Idiomatic Expression, Critical Analysis,
-- Persuasive Writing -- covering figurative language, evaluating dense
-- arguments, and rhetorical devices. Completes the General track's
-- level coverage from A1 through C2. All text is original, written for
-- this platform.
--
-- Run once in the Supabase SQL Editor, after Units 1-6's seeds have
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('4a318764-3163-457a-8940-aad3df0538e8', (select id from public.courses where slug = 'general-english'), 'mastering-english', 'Mastering English', 'Idioms, critical analysis, and persuasive writing for near-native command of English.', 'general', 7, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('4e71244c-f25f-460a-ae81-1d39fc3c522b', '4a318764-3163-457a-8940-aad3df0538e8', 'idiomatic-expression', 'Idiomatic Expression', 'Interpret and use figurative language and idioms in context.', 'C2', 'vocabulary', 1, 15, 'published'),
('ebbe58df-e762-4f11-b0e6-5e1a431c3f4d', '4a318764-3163-457a-8940-aad3df0538e8', 'critical-analysis', 'Critical Analysis', 'Critically evaluate dense academic-style arguments.', 'C2', 'reading', 2, 15, 'published'),
('7292e254-9dbf-4784-9bf4-4f53902d3a70', '4a318764-3163-457a-8940-aad3df0538e8', 'persuasive-writing', 'Persuasive Writing', 'Recognize and use rhetorical devices to write persuasively.', 'C2', 'writing', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('4e71244c-f25f-460a-ae81-1d39fc3c522b', 'reading_passage', 'After the merger fell through at the last minute, the CEO admitted the whole plan had been a house of cards from the start. "We were building on shaky foundations," she said, "and it was only a matter of time before it all came crashing down."', 1),
('ebbe58df-e762-4f11-b0e6-5e1a431c3f4d', 'reading_passage', 'The report''s conclusions, while superficially compelling, rest on a methodology that conflates correlation with causation at several key junctures. This is not to say the underlying data is without value; rather, the interpretive leap from observed patterns to prescriptive policy recommendations is, at best, premature.', 1),
('7292e254-9dbf-4784-9bf4-4f53902d3a70', 'reading_passage', 'Consider, for a moment, what kind of city we want to leave behind for the next generation. Is it one choked by traffic and pollution, or one defined by clean air, green spaces, and neighborhoods built for people, not cars? The choice, I would submit, is not merely urban planning -- it is a moral one.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('60d303b0-3946-4366-a5fd-23193d5bcc4f', '4e71244c-f25f-460a-ae81-1d39fc3c522b', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('c4b408ed-3736-4492-9679-bd501e53c224', '4e71244c-f25f-460a-ae81-1d39fc3c522b', 'writing', 'writing', 2, 'Write 2-3 sentences using an idiom of your choice to describe a situation (real or invented).', 8, 'published'),
('6f2c1b79-deb7-4563-9901-3121a24a2ab1', 'ebbe58df-e762-4f11-b0e6-5e1a431c3f4d', 'multiple_choice', 'reading', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('ed675c7c-1059-4417-a460-bcf055953c9a', 'ebbe58df-e762-4f11-b0e6-5e1a431c3f4d', 'writing', 'writing', 2, 'Write a short critical response (3-4 sentences) to a claim you disagree with, distinguishing correlation from causation if relevant.', 10, 'published'),
('3f327bd2-7b87-4736-ba01-b5e333a98f9c', '7292e254-9dbf-4784-9bf4-4f53902d3a70', 'multiple_choice', 'reading', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('a1d1be5a-1b8b-4e6f-a11b-330b4b8f6cac', '7292e254-9dbf-4784-9bf4-4f53902d3a70', 'writing', 'writing', 2, 'Write a short persuasive paragraph (4-5 sentences) on a topic of your choice, using at least one rhetorical question.', 12, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('38fe2164-1e12-4a7b-b9f0-fb05fb0f83c5', '60d303b0-3946-4366-a5fd-23193d5bcc4f', 'What does "a house of cards" mean in this context?', 'multiple_choice', 1),
('08521f7d-077d-4d98-abe7-970ca7ae6ede', '60d303b0-3946-4366-a5fd-23193d5bcc4f', 'What does "came crashing down" suggest happened to the plan?', 'multiple_choice', 2),
('d8dfd4fc-9cf4-4c4c-a74d-78eeebcf44d9', '60d303b0-3946-4366-a5fd-23193d5bcc4f', 'True or false: the CEO believed the plan had a solid foundation.', 'true_false', 3),
('2855eb28-65dd-406a-a5cf-436d5d567227', '6f2c1b79-deb7-4563-9901-3121a24a2ab1', 'What is the author''s main criticism of the report?', 'multiple_choice', 1),
('3f999c78-c039-4c93-93f7-fad3d023ba4e', '6f2c1b79-deb7-4563-9901-3121a24a2ab1', 'How does the author view the underlying data?', 'multiple_choice', 2),
('260e7f8b-ffb6-4e65-a188-736d3d278120', '6f2c1b79-deb7-4563-9901-3121a24a2ab1', 'True or false: the author considers the policy recommendations well-supported.', 'true_false', 3),
('ffceab30-eb3c-49e1-b36b-446df6856c66', '3f327bd2-7b87-4736-ba01-b5e333a98f9c', 'The opening question ("Consider, for a moment...") is an example of which rhetorical device?', 'multiple_choice', 1),
('820e3064-5594-44cf-9a6a-924ad2847360', '3f327bd2-7b87-4736-ba01-b5e333a98f9c', 'What does the author claim the choice ultimately is?', 'multiple_choice', 2),
('ae9ddace-29ee-4339-92b8-42a6f5f1b1d2', '3f327bd2-7b87-4736-ba01-b5e333a98f9c', 'True or false: the author presents both options as equally desirable.', 'true_false', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('38fe2164-1e12-4a7b-b9f0-fb05fb0f83c5', 'A game people played', false, 1),
('38fe2164-1e12-4a7b-b9f0-fb05fb0f83c5', 'Something fragile and likely to fail', true, 2),
('38fe2164-1e12-4a7b-b9f0-fb05fb0f83c5', 'A literal building made of cards', false, 3),
('08521f7d-077d-4d98-abe7-970ca7ae6ede', 'It succeeded unexpectedly', false, 1),
('08521f7d-077d-4d98-abe7-970ca7ae6ede', 'It failed completely', true, 2),
('08521f7d-077d-4d98-abe7-970ca7ae6ede', 'It was postponed', false, 3),
('d8dfd4fc-9cf4-4c4c-a74d-78eeebcf44d9', 'True', false, 1),
('d8dfd4fc-9cf4-4c4c-a74d-78eeebcf44d9', 'False', true, 2),
('2855eb28-65dd-406a-a5cf-436d5d567227', 'The data was fabricated', false, 1),
('2855eb28-65dd-406a-a5cf-436d5d567227', 'It confuses correlation with causation', true, 2),
('2855eb28-65dd-406a-a5cf-436d5d567227', 'It has no policy recommendations', false, 3),
('3f999c78-c039-4c93-93f7-fad3d023ba4e', 'Completely worthless', false, 1),
('3f999c78-c039-4c93-93f7-fad3d023ba4e', 'Valuable, despite the flawed interpretation', true, 2),
('3f999c78-c039-4c93-93f7-fad3d023ba4e', 'Irrelevant to the conclusions', false, 3),
('260e7f8b-ffb6-4e65-a188-736d3d278120', 'True', false, 1),
('260e7f8b-ffb6-4e65-a188-736d3d278120', 'False', true, 2),
('ffceab30-eb3c-49e1-b36b-446df6856c66', 'A direct appeal to the reader', true, 1),
('ffceab30-eb3c-49e1-b36b-446df6856c66', 'A statistic', false, 2),
('ffceab30-eb3c-49e1-b36b-446df6856c66', 'A historical anecdote', false, 3),
('820e3064-5594-44cf-9a6a-924ad2847360', 'A purely technical question', false, 1),
('820e3064-5594-44cf-9a6a-924ad2847360', 'A moral one', true, 2),
('820e3064-5594-44cf-9a6a-924ad2847360', 'An economic one only', false, 3),
('ae9ddace-29ee-4339-92b8-42a6f5f1b1d2', 'True', false, 1),
('ae9ddace-29ee-4339-92b8-42a6f5f1b1d2', 'False', true, 2);

