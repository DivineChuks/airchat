-- Sample data for local development so dashboard pages have something to render
-- before the n8n pipeline is connected. Safe to re-run: clears existing rows first.
truncate table public.reports restart identity;
delete from public.constituents;

insert into public.constituents (id, full_name, phone, telegram_user_id, lga, ward, community, language, opt_in_campaign_broadcasts, opt_in_issue_updates, source_channel)
values
  ('00000000-0000-0000-0000-000000000001', 'Aniekan Udo', '+2348030000001', 'tg_1001', 'Uyo', 'Ward 4', 'Ewet Housing', 'English', true, true, 'telegram'),
  ('00000000-0000-0000-0000-000000000002', 'Grace Etim', '+2348030000002', 'tg_1002', 'Uyo', 'Ward 2', 'Shelter Afrique', 'English', true, true, 'telegram'),
  ('00000000-0000-0000-0000-000000000003', 'Ime Bassey', '+2348030000003', null, 'Etinan', 'Ward 1', 'Central Etinan', 'English', false, true, 'web_chat'),
  ('00000000-0000-0000-0000-000000000004', 'Ubong Akpan', '+2348030000004', 'tg_1004', 'Ikot Ekpene', 'Ward 3', 'Aka Road', 'English', true, true, 'telegram'),
  ('00000000-0000-0000-0000-000000000005', 'Mfon Effiong', '+2348030000005', 'tg_1005', 'Uyo', 'Ward 4', 'Ewet Housing', 'English', true, false, 'telegram');

insert into public.reports (constituent_id, citizen_name, phone, telegram_user_id, message, summary, category, subcategory, priority, status, department, lga, ward, community, latitude, longitude, language, sentiment, source_channel, created_at)
values
  ('00000000-0000-0000-0000-000000000001', 'Aniekan Udo', '+2348030000001', 'tg_1001', 'I haven''t had electricity for two weeks.', 'Prolonged power outage in Ewet Housing', 'Infrastructure', 'Electricity', 'high', 'new', 'Ministry of Power', 'Uyo', 'Ward 4', 'Ewet Housing', 5.0342, 7.9128, 'English', 'negative', 'telegram', now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000002', 'Grace Etim', '+2348030000002', 'tg_1002', 'There is flooding in my community.', 'Flooding reported in Shelter Afrique estate', 'Infrastructure', 'Water', 'critical', 'assigned', 'Ministry of Environment', 'Uyo', 'Ward 2', 'Shelter Afrique', 5.0421, 7.9033, 'English', 'negative', 'telegram', now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000003', 'Ime Bassey', '+2348030000003', null, 'The health centre has no drugs.', 'Drug stockout at Central Etinan health centre', 'Healthcare', null, 'critical', 'in_progress', 'Ministry of Health', 'Etinan', 'Ward 1', 'Central Etinan', 4.9302, 7.8452, 'English', 'negative', 'web_chat', now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000004', 'Ubong Akpan', '+2348030000004', 'tg_1004', 'The road on Aka Road is badly damaged and causing accidents.', 'Damaged road causing accidents on Aka Road', 'Infrastructure', 'Roads', 'high', 'new', 'Ministry of Works', 'Ikot Ekpene', 'Ward 3', 'Aka Road', 5.1783, 7.7114, 'English', 'negative', 'telegram', now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000005', 'Mfon Effiong', '+2348030000005', 'tg_1005', 'Thank you for fixing the borehole, it works well now.', 'Positive feedback on repaired community borehole', 'Infrastructure', 'Water', 'low', 'resolved', 'Ministry of Water Resources', 'Uyo', 'Ward 4', 'Ewet Housing', 5.0342, 7.9128, 'English', 'positive', 'telegram', now() - interval '2 days'),
  (null, 'Anonymous', null, 'tg_1006', 'No jobs for youths in our area, please help.', 'Youth unemployment concern raised', 'Employment', null, 'medium', 'new', 'Ministry of Youth', 'Uyo', 'Ward 1', 'Osongama', 5.0501, 7.9256, 'English', 'negative', 'telegram', now() - interval '6 hours'),
  (null, 'Anonymous', null, null, 'Farmers in our community need fertilizer support this planting season.', 'Fertilizer support request from farmers', 'Agriculture', null, 'medium', 'new', 'Ministry of Agriculture', 'Etinan', 'Ward 2', 'Nditia', 4.9187, 7.8601, 'English', 'neutral', 'web_chat', now() - interval '12 hours'),
  (null, 'Anonymous', null, 'tg_1007', 'There has been a rise in cases of theft at night, we need more security patrols.', 'Increased theft cases, requesting security patrols', 'Security', null, 'critical', 'assigned', 'Ministry of Security', 'Ikot Ekpene', 'Ward 1', 'Itu Road', 5.1822, 7.7203, 'English', 'negative', 'telegram', now() - interval '4 hours'),
  (null, 'Anonymous', null, null, 'The primary school in our area has no teachers for maths and science.', 'Teacher shortage at local primary school', 'Education', null, 'high', 'new', 'Ministry of Education', 'Uyo', 'Ward 3', 'Idu Uruan', 5.0198, 7.9411, 'English', 'negative', 'web_chat', now() - interval '8 hours'),
  (null, 'Anonymous', null, 'tg_1008', 'Erosion is threatening homes near the river.', 'Erosion threatening riverside homes', 'Environment', null, 'critical', 'new', 'Ministry of Environment', 'Etinan', 'Ward 3', 'Ikot Obio Tom', 4.9256, 7.8398, 'English', 'negative', 'telegram', now() - interval '1 hour');
