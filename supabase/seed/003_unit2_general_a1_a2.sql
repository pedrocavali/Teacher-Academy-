-- Unit 2 (General track, A1-A2): "Everyday Life"
-- Three original lessons -- Where Are You From?, At the Market, Ordering Food --
-- covering nationalities/verb "to be", demonstratives (this/that/these/those),
-- and polite requests. All text is original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after Unit 1's seed (002_...) has
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('1a182204-4dd2-4436-aaa7-eaede7fffe7b', (select id from public.courses where slug = 'general-english'), 'everyday-life', 'Everyday Life', 'Nationalities, shopping, and ordering food -- practical everyday English.', 'general', 2, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('15bc4b66-b16b-4083-a182-48cb2caf755e', '1a182204-4dd2-4436-aaa7-eaede7fffe7b', 'where-are-you-from', 'Where Are You From?', 'Talk about nationality and occupation using the verb "to be" (he/she/it).', 'A1', 'grammar', 1, 15, 'published'),
('75fef6c7-7b29-4306-8869-fd83ec6bbbd3', '1a182204-4dd2-4436-aaa7-eaede7fffe7b', 'at-the-market', 'At the Market', 'Use this/that/these/those to talk about nearby and distant objects while shopping.', 'A2', 'grammar', 2, 15, 'published'),
('8d5bbdf3-faf6-4f3c-bfc5-f0dd0b090f7a', '1a182204-4dd2-4436-aaa7-eaede7fffe7b', 'ordering-food', 'Ordering Food', 'Order food and drinks politely using "Can I have...?".', 'A2', 'vocabulary', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('15bc4b66-b16b-4083-a182-48cb2caf755e', 'reading_passage', 'This is Yuki. He is from Japan. He is a musician. This is Elena. She is from Poland. She is an engineer. This is a photo of their office. It is in London.', 1),
('75fef6c7-7b29-4306-8869-fd83ec6bbbd3', 'reading_passage', 'Paula is at a small market on vacation. She sees some souvenirs on the table in front of her, and some on a shelf farther away. "How much is this bag?" she asks. "It''s fifteen dollars," says the seller. "And how much are those postcards, over there?" "They''re two dollars each." Paula buys the bag and three postcards.', 1),
('8d5bbdf3-faf6-4f3c-bfc5-f0dd0b090f7a', 'transcript', 'Waiter: Hi, are you ready to order?
Customer: Yes. Can I have a chicken sandwich, please?
Waiter: Sure. Anything to drink?
Customer: Can I have a lemonade too, please?
Waiter: Of course. That''s eight dollars fifty.
Customer: Here you go.
Waiter: Thanks! I''ll bring it right over.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('0b324676-4aba-48fe-86e4-6afe9bbee7b2', '15bc4b66-b16b-4083-a182-48cb2caf755e', 'multiple_choice', 'grammar', 1, 'Choose the correct form of the verb "to be", or answer true or false about the text above.', 5, 'published'),
('01f427c1-53f1-4936-bb9b-3acfb7ed1081', '15bc4b66-b16b-4083-a182-48cb2caf755e', 'speaking', 'speaking', 2, 'Talk about yourself: say your name, your nationality, and your job (or say "I am a student").', 5, 'published'),
('d2719849-c9a7-4b6a-8de5-99dd2ceab670', '75fef6c7-7b29-4306-8869-fd83ec6bbbd3', 'multiple_choice', 'grammar', 1, 'Choose "this", "that", "these", or "those", based on the text above (near = this/these, far = that/those).', 5, 'published'),
('bcac08ff-f9e7-4fdc-a797-07e841772f2f', '75fef6c7-7b29-4306-8869-fd83ec6bbbd3', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('c3157006-9437-4d52-a9dc-9360056a37e1', '8d5bbdf3-faf6-4f3c-bfc5-f0dd0b090f7a', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the conversation above.', 5, 'published'),
('a0482bc6-230e-43ee-a64d-2d58196c5036', '8d5bbdf3-faf6-4f3c-bfc5-f0dd0b090f7a', 'writing', 'writing', 2, 'Write a short dialogue (4-6 lines) ordering food and a drink at a restaurant.', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('d8e62897-c2ae-4c84-841c-e6652fd38f3c', '0b324676-4aba-48fe-86e4-6afe9bbee7b2', 'He ___ from Japan.', 'multiple_choice', 1),
('229b2058-a388-48cf-9e4e-5d1540180513', '0b324676-4aba-48fe-86e4-6afe9bbee7b2', 'She ___ an engineer.', 'multiple_choice', 2),
('ce01edef-d172-4452-b921-6012e5dcf1bc', '0b324676-4aba-48fe-86e4-6afe9bbee7b2', 'Their office ___ in London.', 'multiple_choice', 3),
('b7739ec6-0cb8-4aa3-ab91-653a551f45cb', '0b324676-4aba-48fe-86e4-6afe9bbee7b2', 'True or false: Yuki is from Poland.', 'true_false', 4),
('36e0d066-817e-47e0-98e0-e956168862cd', 'd2719849-c9a7-4b6a-8de5-99dd2ceab670', 'Paula asks about the bag in front of her: "How much is ___ bag?"', 'multiple_choice', 1),
('4be7ee0f-58b9-4942-ad57-1a8586548998', 'd2719849-c9a7-4b6a-8de5-99dd2ceab670', 'She asks about the postcards far away: "How much are ___ postcards?"', 'multiple_choice', 2),
('ecc97754-7b70-4270-b28b-812445000697', 'd2719849-c9a7-4b6a-8de5-99dd2ceab670', 'True or false: Paula buys two postcards.', 'true_false', 3),
('4f06687f-4d05-4000-8f27-b77e44de2dd2', 'bcac08ff-f9e7-4fdc-a797-07e841772f2f', 'The postcards cost two dollars ___ (for one).', 'fill_blank', 1),
('80c482ee-65a0-4354-9f08-44b5eb055941', 'c3157006-9437-4d52-a9dc-9360056a37e1', 'What does the customer order to eat?', 'multiple_choice', 1),
('08da3d9f-3064-412d-bd2c-25baef8135de', 'c3157006-9437-4d52-a9dc-9360056a37e1', 'What does the customer order to drink?', 'multiple_choice', 2),
('4cc9e04c-2d31-4b77-9550-ca0fe64066de', 'c3157006-9437-4d52-a9dc-9360056a37e1', 'True or false: the total is eight dollars fifty.', 'true_false', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('d8e62897-c2ae-4c84-841c-e6652fd38f3c', 'am', false, 1),
('d8e62897-c2ae-4c84-841c-e6652fd38f3c', 'is', true, 2),
('d8e62897-c2ae-4c84-841c-e6652fd38f3c', 'are', false, 3),
('229b2058-a388-48cf-9e4e-5d1540180513', 'am', false, 1),
('229b2058-a388-48cf-9e4e-5d1540180513', 'is', true, 2),
('229b2058-a388-48cf-9e4e-5d1540180513', 'are', false, 3),
('ce01edef-d172-4452-b921-6012e5dcf1bc', 'am', false, 1),
('ce01edef-d172-4452-b921-6012e5dcf1bc', 'is', true, 2),
('ce01edef-d172-4452-b921-6012e5dcf1bc', 'are', false, 3),
('b7739ec6-0cb8-4aa3-ab91-653a551f45cb', 'True', false, 1),
('b7739ec6-0cb8-4aa3-ab91-653a551f45cb', 'False', true, 2),
('36e0d066-817e-47e0-98e0-e956168862cd', 'this', true, 1),
('36e0d066-817e-47e0-98e0-e956168862cd', 'that', false, 2),
('36e0d066-817e-47e0-98e0-e956168862cd', 'those', false, 3),
('4be7ee0f-58b9-4942-ad57-1a8586548998', 'this', false, 1),
('4be7ee0f-58b9-4942-ad57-1a8586548998', 'that', false, 2),
('4be7ee0f-58b9-4942-ad57-1a8586548998', 'those', true, 3),
('ecc97754-7b70-4270-b28b-812445000697', 'True', false, 1),
('ecc97754-7b70-4270-b28b-812445000697', 'False', true, 2),
('4f06687f-4d05-4000-8f27-b77e44de2dd2', 'each', true, 1),
('80c482ee-65a0-4354-9f08-44b5eb055941', 'A chicken sandwich', true, 1),
('80c482ee-65a0-4354-9f08-44b5eb055941', 'A cheese sandwich', false, 2),
('80c482ee-65a0-4354-9f08-44b5eb055941', 'A salad', false, 3),
('08da3d9f-3064-412d-bd2c-25baef8135de', 'Coffee', false, 1),
('08da3d9f-3064-412d-bd2c-25baef8135de', 'Lemonade', true, 2),
('08da3d9f-3064-412d-bd2c-25baef8135de', 'Water', false, 3),
('4cc9e04c-2d31-4b77-9550-ca0fe64066de', 'True', true, 1),
('4cc9e04c-2d31-4b77-9550-ca0fe64066de', 'False', false, 2);

