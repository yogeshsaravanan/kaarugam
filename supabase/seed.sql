-- Seed catalogue (mirrors lib/seed.ts). Run after 0001_init.sql.
insert into products (id,name,category,price_paise,base,border,pallu,pattern,blurb) values
 ('t1','Kanjeevaram Vermilion','Traditional',1850000,'#8C1F3B','#C6952F','#6E1730','temple','Classic Kanjeevaram weave in deep vermilion with a wide gold zari border.'),
 ('t2','Temple Mustard Silk','Traditional',1520000,'#C08A2E','#5B2A1A','#7A3A20','temple','Mustard-gold body with a hand-woven maroon temple border.'),
 ('t3','Emerald Zari Silk','Traditional',2100000,'#1E6E6A','#C6952F','#12433F','check','Deep emerald silk lifted by a fine checked zari grid.'),
 ('m1','Powder Blush Silk','Modern',980000,'#E3B7B0','#C6952F','#C98E86','plain','Lightweight modern silk in soft blush with a slim gold edge.'),
 ('m2','Lilac Ombre Silk','Modern',1140000,'#B7A0D8','#8C6FB3','#9A7FC2','plain','Contemporary ombre drape, lilac fading into deep violet.'),
 ('m3','Champagne Shimmer Silk','Modern',1320000,'#E7D9B8','#A87B22','#D8C398','check','Understated champagne silk with a whisper of zari shimmer.'),
 ('w1','Bridal Crimson Kanjeevaram','Marriage',4250000,'#A3183F','#C6952F','#7A0F2C','temple','Heavy bridal Kanjeevaram in crimson, dense gold zari throughout.'),
 ('w2','Magenta Zari Bridal Silk','Marriage',3890000,'#B32268','#C6952F','#831A4B','temple','Rich magenta bridal silk with a broad temple-motif pallu.'),
 ('w3','Maroon Temple Bridal Silk','Marriage',4590000,'#6E1730','#C6952F','#4E0F22','temple','The classic wedding maroon, woven dense with temple zari.'),
 ('o1','Mint Zari Casual Silk','Casual & Others',640000,'#A7CFC2','#C6952F','#84B3A4','plain','Easy everyday silk in cool mint with a fine gold line.'),
 ('o2','Ivory Thread Casual Silk','Casual & Others',710000,'#F1E7D3','#8C1F3B','#E3D3B4','check','Soft ivory silk, small maroon thread checks throughout.'),
 ('o3','Teal Zari Office Silk','Casual & Others',830000,'#1E6E6A','#E7D9B8','#15514E','plain','Office-friendly teal silk with a slim ivory-gold border.')
on conflict (id) do update set
  name=excluded.name, category=excluded.category, price_paise=excluded.price_paise,
  base=excluded.base, border=excluded.border, pallu=excluded.pallu,
  pattern=excluded.pattern, blurb=excluded.blurb;

insert into reviews (product_id,name,rating,text) values
 ('t1','Radha K.',5,'The zari border is even richer in person. Draped beautifully for my sister''s function.'),
 ('w1','Meena S.',5,'Wore this for my wedding reception, got so many compliments on the pallu.'),
 ('m1','Anjali P.',4,'Lovely light silk, great for a day event. Wish the blush was a touch deeper.');
