-- Unit 3 (General track, B1): "Around Town"
-- Three original lessons -- Giving Directions, Making Plans, A Trip Abroad --
-- covering imperatives/prepositions of place, the "going to" future and
-- present continuous for arrangements, and travel vocabulary. All text is
-- original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after Units 1 and 2's seeds have
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('71c56ec9-0aa8-4f9e-8816-90a17bce1479', (select id from public.courses where slug = 'general-english'), 'around-town', 'Around Town', 'Directions, plans, and travel -- getting things done in English.', 'general', 3, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('0cbed9ee-4078-4172-9c95-371294e2dbc8', '71c56ec9-0aa8-4f9e-8816-90a17bce1479', 'giving-directions', 'Giving Directions', 'Give and understand directions using imperatives and prepositions of place.', 'B1', 'grammar', 1, 15, 'published'),
('30efbf7e-3eea-4ece-ac3a-1c08d90cadef', '71c56ec9-0aa8-4f9e-8816-90a17bce1479', 'making-plans', 'Making Plans', 'Talk about future plans and arrangements using "going to" and the present continuous.', 'B1', 'grammar', 2, 15, 'published'),
('72935b05-5e9a-47df-9c5f-4b8ba6d9efc2', '71c56ec9-0aa8-4f9e-8816-90a17bce1479', 'a-trip-abroad', 'A Trip Abroad', 'Read about travel experiences and learn common travel vocabulary.', 'B1', 'reading', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('0cbed9ee-4078-4172-9c95-371294e2dbc8', 'reading_passage', '"Excuse me, how do I get to the train station?" "Go straight ahead for two blocks. Then turn left at the bakery. Walk past the bank, and the station is on your right, next to the park."', 1),
('30efbf7e-3eea-4ece-ac3a-1c08d90cadef', 'reading_passage', 'Marta is planning her weekend. On Saturday morning, she is going to visit her grandmother. In the afternoon, she is meeting some friends for lunch. On Sunday, she is going to clean her apartment and relax.', 1),
('72935b05-5e9a-47df-9c5f-4b8ba6d9efc2', 'reading_passage', 'Last summer, Daniel took a trip to Portugal. He booked a flight two months in advance and stayed in a small guesthouse near the coast. Every morning, he walked to the beach and had breakfast at a local cafe. On his last day, he visited a museum and bought souvenirs for his family before heading to the airport.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('1c25d71b-afde-48c4-b22c-f8680e120d91', '0cbed9ee-4078-4172-9c95-371294e2dbc8', 'multiple_choice', 'grammar', 1, 'Answer the questions based on the directions above.', 5, 'published'),
('b0a9d502-3d5c-41e0-ad95-06a0cf2c0327', '0cbed9ee-4078-4172-9c95-371294e2dbc8', 'speaking', 'speaking', 2, 'Give directions from your home to a place nearby, such as a shop or a park.', 5, 'published'),
('3374783f-3f75-4bc2-bdbb-1798afe7c04f', '30efbf7e-3eea-4ece-ac3a-1c08d90cadef', 'multiple_choice', 'grammar', 1, 'Answer the questions based on the text above.', 5, 'published'),
('3c117572-88f2-4ec4-94f9-f799301a60bb', '30efbf7e-3eea-4ece-ac3a-1c08d90cadef', 'fill_blank', 'grammar', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('d916fdca-d1d6-4f96-834a-ced45d9f1fd2', '30efbf7e-3eea-4ece-ac3a-1c08d90cadef', 'writing', 'writing', 3, 'Write a short paragraph (3-5 sentences) about your plans for next weekend.', 10, 'published'),
('a0bc2cc6-c127-46d0-bcb7-0aba289de73a', '72935b05-5e9a-47df-9c5f-4b8ba6d9efc2', 'multiple_choice', 'reading', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('f9173fdd-dc9a-480b-9e7d-cbbe1fa9b14f', '72935b05-5e9a-47df-9c5f-4b8ba6d9efc2', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('59df5a08-6d1d-4717-96d6-d6be3c6cc5fc', '1c25d71b-afde-48c4-b22c-f8680e120d91', 'Where do you turn left?', 'multiple_choice', 1),
('5d0afb9a-2c6f-46c3-abe7-60821aac2460', '1c25d71b-afde-48c4-b22c-f8680e120d91', 'What is the station next to?', 'multiple_choice', 2),
('75ce9c88-087e-4a9c-a480-93fb57702854', '1c25d71b-afde-48c4-b22c-f8680e120d91', '"___ straight ahead for two blocks."', 'multiple_choice', 3),
('caeb704b-826b-4d28-b7ac-6547c8c3df4b', '1c25d71b-afde-48c4-b22c-f8680e120d91', 'True or false: the station is on the left.', 'true_false', 4),
('8f533c0b-12c4-4352-9a2c-bd7fb73a8d9a', '3374783f-3f75-4bc2-bdbb-1798afe7c04f', 'What is Marta going to do on Saturday morning?', 'multiple_choice', 1),
('cd837efd-60d7-4151-a1e2-173ea6935224', '3374783f-3f75-4bc2-bdbb-1798afe7c04f', '"She ___ meeting friends for lunch."', 'multiple_choice', 2),
('db4a4e40-b618-4b87-b2f8-262f7cc08fec', '3374783f-3f75-4bc2-bdbb-1798afe7c04f', 'True or false: Marta is going to relax on Sunday.', 'true_false', 3),
('233964bf-788c-43ac-97ef-f1af533bde37', '3c117572-88f2-4ec4-94f9-f799301a60bb', 'She ___ going to clean her apartment on Sunday.', 'fill_blank', 1),
('88164fdd-8de0-4219-915e-525a0ae94ed5', 'a0bc2cc6-c127-46d0-bcb7-0aba289de73a', 'When did Daniel book his flight?', 'multiple_choice', 1),
('a792f59c-a536-4df2-908a-2fecc8091e4a', 'a0bc2cc6-c127-46d0-bcb7-0aba289de73a', 'Where did he stay?', 'multiple_choice', 2),
('3bb3e1b4-0a40-4e5c-b475-b0eb3bc49899', 'a0bc2cc6-c127-46d0-bcb7-0aba289de73a', 'True or false: Daniel visited a museum on his last day.', 'true_false', 3),
('d241aacd-764b-4ed6-96b0-206c864a57e1', 'f9173fdd-dc9a-480b-9e7d-cbbe1fa9b14f', 'A document you need to travel to another country is called a ___.', 'fill_blank', 1);

insert into public.question_options (question_id, text, is_correct, order_index) values
('59df5a08-6d1d-4717-96d6-d6be3c6cc5fc', 'At the bakery', true, 1),
('59df5a08-6d1d-4717-96d6-d6be3c6cc5fc', 'At the bank', false, 2),
('59df5a08-6d1d-4717-96d6-d6be3c6cc5fc', 'At the park', false, 3),
('5d0afb9a-2c6f-46c3-abe7-60821aac2460', 'The bakery', false, 1),
('5d0afb9a-2c6f-46c3-abe7-60821aac2460', 'The bank', false, 2),
('5d0afb9a-2c6f-46c3-abe7-60821aac2460', 'The park', true, 3),
('75ce9c88-087e-4a9c-a480-93fb57702854', 'Go', true, 1),
('75ce9c88-087e-4a9c-a480-93fb57702854', 'Going', false, 2),
('75ce9c88-087e-4a9c-a480-93fb57702854', 'Went', false, 3),
('caeb704b-826b-4d28-b7ac-6547c8c3df4b', 'True', false, 1),
('caeb704b-826b-4d28-b7ac-6547c8c3df4b', 'False', true, 2),
('8f533c0b-12c4-4352-9a2c-bd7fb73a8d9a', 'Clean her apartment', false, 1),
('8f533c0b-12c4-4352-9a2c-bd7fb73a8d9a', 'Visit her grandmother', true, 2),
('8f533c0b-12c4-4352-9a2c-bd7fb73a8d9a', 'Meet friends for lunch', false, 3),
('cd837efd-60d7-4151-a1e2-173ea6935224', 'is', true, 1),
('cd837efd-60d7-4151-a1e2-173ea6935224', 'are', false, 2),
('cd837efd-60d7-4151-a1e2-173ea6935224', 'am', false, 3),
('db4a4e40-b618-4b87-b2f8-262f7cc08fec', 'True', true, 1),
('db4a4e40-b618-4b87-b2f8-262f7cc08fec', 'False', false, 2),
('233964bf-788c-43ac-97ef-f1af533bde37', 'is', true, 1),
('88164fdd-8de0-4219-915e-525a0ae94ed5', 'One week before', false, 1),
('88164fdd-8de0-4219-915e-525a0ae94ed5', 'Two months in advance', true, 2),
('88164fdd-8de0-4219-915e-525a0ae94ed5', 'The day before', false, 3),
('a792f59c-a536-4df2-908a-2fecc8091e4a', 'A hotel in the city', false, 1),
('a792f59c-a536-4df2-908a-2fecc8091e4a', 'A small guesthouse near the coast', true, 2),
('a792f59c-a536-4df2-908a-2fecc8091e4a', 'With a friend', false, 3),
('3bb3e1b4-0a40-4e5c-b475-b0eb3bc49899', 'True', true, 1),
('3bb3e1b4-0a40-4e5c-b475-b0eb3bc49899', 'False', false, 2),
('d241aacd-764b-4ed6-96b0-206c864a57e1', 'passport', true, 1);

