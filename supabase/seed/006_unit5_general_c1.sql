-- Unit 5 (General track, C1): "Advanced Communication"
-- Three original lessons -- Nuanced Opinions, Debating Ideas, Understanding
-- Nuance -- covering inversion for emphasis, hedging language, formal
-- debate vocabulary, and dense academic-style reading. All text is
-- original, written for this platform.
--
-- Run once in the Supabase SQL Editor, after Units 1-4's seeds have
-- already created the "general-english" course. Not idempotent.

insert into public.units (id, course_id, slug, title, description, track, order_index, status) values
('f2103add-5366-4745-9c2e-c11d8b0e3549', (select id from public.courses where slug = 'general-english'), 'advanced-communication', 'Advanced Communication', 'Nuanced opinions, formal debate, and dense reading for advanced learners.', 'general', 5, 'published');

insert into public.lessons (id, unit_id, slug, title, objective, cefr_level, primary_skill, order_index, estimated_minutes, status) values
('0ccbfc7e-4d17-405e-8613-26d0d547397a', 'f2103add-5366-4745-9c2e-c11d8b0e3549', 'nuanced-opinions', 'Nuanced Opinions', 'Use inversion for emphasis and hedging language to express opinions carefully.', 'C1', 'grammar', 1, 15, 'published'),
('e9063095-12b2-4e33-9319-99d6c2560366', 'f2103add-5366-4745-9c2e-c11d8b0e3549', 'debating-ideas', 'Debating Ideas', 'Use formal debate language to present and challenge ideas politely.', 'C1', 'vocabulary', 2, 15, 'published'),
('8860ea02-c84a-4bdd-a2a1-6c9fb8cd331f', 'f2103add-5366-4745-9c2e-c11d8b0e3549', 'understanding-nuance', 'Understanding Nuance', 'Read and interpret a dense academic-style passage.', 'C1', 'reading', 3, 15, 'published');

insert into public.content_items (lesson_id, type, text_content, order_index) values
('0ccbfc7e-4d17-405e-8613-26d0d547397a', 'reading_passage', 'Rarely do people change their minds after a single argument. It seems, however, that presenting evidence gradually, rather than all at once, tends to be more persuasive. This suggests that patience is often more effective than forcefulness in changing someone''s opinion.', 1),
('e9063095-12b2-4e33-9319-99d6c2560366', 'reading_passage', 'In a formal debate, speakers often use phrases like "I would argue that..." or "While that may be true, one could counter that..." to present and challenge ideas politely. A strong debater acknowledges the opposing view before presenting a rebuttal.', 1),
('8860ea02-c84a-4bdd-a2a1-6c9fb8cd331f', 'reading_passage', 'It would be an oversimplification to claim that technology alone determines social change; rather, technological developments interact with existing cultural and economic conditions to produce outcomes that are neither fully predictable nor entirely random.', 1);

insert into public.activities (id, lesson_id, type, skill, order_index, instructions, estimated_minutes, status) values
('e15eded4-1be1-47fe-9c0e-dbfe0b259b5b', '0ccbfc7e-4d17-405e-8613-26d0d547397a', 'multiple_choice', 'grammar', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('71dcda23-65c5-431f-b046-075098da40f2', '0ccbfc7e-4d17-405e-8613-26d0d547397a', 'writing', 'writing', 2, 'Write 2-3 sentences using hedging language (e.g. "It seems that...", "This suggests...") to express a cautious opinion on any topic.', 8, 'published'),
('46d6492c-bf19-4a0e-a118-911482cf8fd2', 'e9063095-12b2-4e33-9319-99d6c2560366', 'multiple_choice', 'vocabulary', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('646ce184-8c02-469d-ad5a-f3f5dafdbd14', 'e9063095-12b2-4e33-9319-99d6c2560366', 'fill_blank', 'vocabulary', 2, 'Complete the sentence with the missing word.', 3, 'published'),
('eacd3a50-0e85-44fe-9241-9bb9c293655d', 'e9063095-12b2-4e33-9319-99d6c2560366', 'speaking', 'speaking', 3, 'Give your opinion on a topic of your choice, then briefly acknowledge and respond to an opposing view.', 5, 'published'),
('ebb0f1ef-9af6-4461-b8cd-675dcde11517', '8860ea02-c84a-4bdd-a2a1-6c9fb8cd331f', 'multiple_choice', 'reading', 1, 'Answer the questions based on the passage above.', 5, 'published'),
('4f783e63-678f-409e-aa20-c94454814d16', '8860ea02-c84a-4bdd-a2a1-6c9fb8cd331f', 'writing', 'writing', 2, 'Write 3-4 sentences giving your own nuanced opinion on how technology affects society.', 10, 'published');

insert into public.questions (id, activity_id, prompt, type, order_index) values
('9f946a62-ba17-413e-8211-5fa2e9cda934', 'e15eded4-1be1-47fe-9c0e-dbfe0b259b5b', '"___ do people change their minds after a single argument."', 'multiple_choice', 1),
('9cecfa09-58a9-4f94-a2c1-3a7fe58f1666', 'e15eded4-1be1-47fe-9c0e-dbfe0b259b5b', 'The phrase "It seems, however, that..." is an example of ___ language, used to soften a claim.', 'multiple_choice', 2),
('08993d91-c2b8-403f-a19d-acb15b8cabad', 'e15eded4-1be1-47fe-9c0e-dbfe0b259b5b', 'True or false: according to the passage, forcefulness is usually more effective than patience.', 'true_false', 3),
('68e4b5f9-f4d7-47fc-8653-869049ac6366', '46d6492c-bf19-4a0e-a118-911482cf8fd2', 'The phrase "one could counter that..." is used to ___.', 'multiple_choice', 1),
('38148dff-635c-4b98-b506-caa7067d8c3a', '46d6492c-bf19-4a0e-a118-911482cf8fd2', 'A "rebuttal" is ___.', 'multiple_choice', 2),
('992bcda1-811e-40f2-839c-dc019092f05b', '46d6492c-bf19-4a0e-a118-911482cf8fd2', 'True or false: a strong debater ignores the opposing view entirely.', 'true_false', 3),
('3c9bf6c1-2ee9-4b69-9233-c8c4a31d43a0', '646ce184-8c02-469d-ad5a-f3f5dafdbd14', '"I would ___ that the evidence is inconclusive."', 'fill_blank', 1),
('cdda9651-6c9e-4585-bfed-4c57509fac0d', 'ebb0f1ef-9af6-4461-b8cd-675dcde11517', 'According to the passage, what determines social change?', 'multiple_choice', 1),
('54df1ad4-5ef2-4872-8e10-f7c7d4426d1a', 'ebb0f1ef-9af6-4461-b8cd-675dcde11517', 'True or false: the passage argues that social change is entirely predictable.', 'true_false', 2),
('4dd54977-d52f-4559-8495-2cc391b987c2', 'ebb0f1ef-9af6-4461-b8cd-675dcde11517', 'The word "oversimplification" suggests the author thinks the claim is...', 'multiple_choice', 3);

insert into public.question_options (question_id, text, is_correct, order_index) values
('9f946a62-ba17-413e-8211-5fa2e9cda934', 'Rarely', true, 1),
('9f946a62-ba17-413e-8211-5fa2e9cda934', 'Rare', false, 2),
('9f946a62-ba17-413e-8211-5fa2e9cda934', 'Rarest', false, 3),
('9cecfa09-58a9-4f94-a2c1-3a7fe58f1666', 'hedging', true, 1),
('9cecfa09-58a9-4f94-a2c1-3a7fe58f1666', 'direct', false, 2),
('9cecfa09-58a9-4f94-a2c1-3a7fe58f1666', 'formal', false, 3),
('08993d91-c2b8-403f-a19d-acb15b8cabad', 'True', false, 1),
('08993d91-c2b8-403f-a19d-acb15b8cabad', 'False', true, 2),
('68e4b5f9-f4d7-47fc-8653-869049ac6366', 'agree completely', false, 1),
('68e4b5f9-f4d7-47fc-8653-869049ac6366', 'introduce an opposing point', true, 2),
('68e4b5f9-f4d7-47fc-8653-869049ac6366', 'end the debate', false, 3),
('38148dff-635c-4b98-b506-caa7067d8c3a', 'a response that argues against a point', true, 1),
('38148dff-635c-4b98-b506-caa7067d8c3a', 'a summary', false, 2),
('38148dff-635c-4b98-b506-caa7067d8c3a', 'a question', false, 3),
('992bcda1-811e-40f2-839c-dc019092f05b', 'True', false, 1),
('992bcda1-811e-40f2-839c-dc019092f05b', 'False', true, 2),
('3c9bf6c1-2ee9-4b69-9233-c8c4a31d43a0', 'argue', true, 1),
('cdda9651-6c9e-4585-bfed-4c57509fac0d', 'Technology alone', false, 1),
('cdda9651-6c9e-4585-bfed-4c57509fac0d', 'The interaction between technology and existing conditions', true, 2),
('cdda9651-6c9e-4585-bfed-4c57509fac0d', 'Random chance alone', false, 3),
('54df1ad4-5ef2-4872-8e10-f7c7d4426d1a', 'True', false, 1),
('54df1ad4-5ef2-4872-8e10-f7c7d4426d1a', 'False', true, 2),
('4dd54977-d52f-4559-8495-2cc391b987c2', 'too simple', true, 1),
('4dd54977-d52f-4559-8495-2cc391b987c2', 'too complex', false, 2),
('4dd54977-d52f-4559-8495-2cc391b987c2', 'completely accurate', false, 3);

