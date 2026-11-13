-- The off-white paint colour is the page ground; the ground went from #EFEBE4 to #FAF8F4.
UPDATE "marks"
SET "tiles" = replace("tiles"::text, '#EFEBE4', '#FAF8F4')::jsonb
WHERE "tiles"::text LIKE '%#EFEBE4%';
