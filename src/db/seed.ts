import { getDb } from './index';
import { hashPassword } from '../services/passwordService.ts';
import {
	auditLogs,
	flags,
	likes,
	menuItems,
	reviews,
	stalls,
	users,
} from './schema';

async function seed() {
	const db = await getDb();
	const now = new Date();
	const testPasswordHash = await hashPassword('rahasia123');

	const insertedUsers = await db
		.insert(users)
		.output()
		.values([
			{ name: 'Admin Utama', email: 'admin@example.com', passwordHash: testPasswordHash, role: 'admin', createdAt: now },
			{ name: 'Pemilik Warung Pagi', email: 'owner.pagi@example.com', passwordHash: testPasswordHash, role: 'owner', createdAt: now },
			{ name: 'Pemilik Dapur Nusantara', email: 'owner.nusantara@example.com', passwordHash: testPasswordHash, role: 'owner', createdAt: now },
			{ name: 'Pemilik Kopi Sudut', email: 'owner.kopi@example.com', passwordHash: testPasswordHash, role: 'owner', createdAt: now },
			{ name: 'Pemilik Rasa Sunda', email: 'owner.sunda@example.com', passwordHash: testPasswordHash, role: 'owner', createdAt: now },
			{ name: 'Pemilik Bakso Jaya', email: 'owner.bakso@example.com', passwordHash: testPasswordHash, role: 'owner', createdAt: now },
			{ name: 'Ayu Lestari', email: 'ayu@example.com', passwordHash: testPasswordHash, role: 'customer', createdAt: now },
			{ name: 'Bima Pratama', email: 'bima@example.com', passwordHash: testPasswordHash, role: 'customer', createdAt: now },
			{ name: 'Citra Dewi', email: 'citra@example.com', passwordHash: testPasswordHash, role: 'customer', createdAt: now },
			{ name: 'Danu Saputra', email: 'danu@example.com', passwordHash: testPasswordHash, role: 'customer', createdAt: now },
			{ name: 'Eka Putri', email: 'eka@example.com', passwordHash: testPasswordHash, role: 'customer', createdAt: now },
		]);

	const owners = insertedUsers.filter((user) => user.role === 'owner');
	const customers = insertedUsers.filter((user) => user.role === 'customer');

	const insertedStalls = await db
		.insert(stalls)
		.output()
		.values([
			{
				ownerId: owners[0].id,
				name: 'Warung Pagi Ceria',
				category: 'Sarapan',
				location: 'Gedung A',
				description: 'Menu sarapan rumahan yang disajikan hangat setiap pagi.',
				avgRating: '4.60',
				reviewCount: 2,
				createdAt: now,
			},
			{
				ownerId: owners[1].id,
				name: 'Dapur Nusantara',
				category: 'Masakan Indonesia',
				location: 'Gedung B',
				description: 'Hidangan khas Indonesia dengan resep keluarga.',
				avgRating: '4.50',
				reviewCount: 2,
				createdAt: now,
			},
			{
				ownerId: owners[2].id,
				name: 'Kopi Sudut Kampus',
				category: 'Minuman',
				location: 'Gedung C',
				description: 'Kopi dan minuman segar untuk menemani waktu belajar.',
				avgRating: '4.00',
				reviewCount: 2,
				createdAt: now,
			},
			{
				ownerId: owners[3].id,
				name: 'Rasa Sunda',
				category: 'Masakan Sunda',
				location: 'Gedung D',
				description: 'Masakan Sunda sederhana dengan lalapan segar.',
				avgRating: '4.50',
				reviewCount: 2,
				createdAt: now,
			},
			{
				ownerId: owners[4].id,
				name: 'Bakso Jaya',
				category: 'Bakso',
				location: 'Gedung E',
				description: 'Bakso sapi dan mi dengan kuah kaldu gurih.',
				avgRating: '4.50',
				reviewCount: 2,
				createdAt: now,
			},
		]);

	await db.insert(menuItems).values(
		insertedStalls.flatMap((stall, index) => {
			const menus = [
				[
					{ name: 'Nasi Uduk', price: 15000 },
					{ name: 'Bubur Ayam', price: 18000 },
					{ name: 'Teh Manis', price: 5000 },
				],
				[
					{ name: 'Nasi Ayam Bakar', price: 28000 },
					{ name: 'Soto Ayam', price: 22000 },
					{ name: 'Es Teh', price: 6000 },
				],
				[
					{ name: 'Kopi Susu', price: 18000 },
					{ name: 'Americano', price: 15000 },
					{ name: 'Es Cokelat', price: 17000 },
				],
				[
					{ name: 'Nasi Timbel', price: 25000 },
					{ name: 'Ayam Goreng', price: 24000 },
					{ name: 'Jus Alpukat', price: 16000 },
				],
				[
					{ name: 'Bakso Urat', price: 22000 },
					{ name: 'Bakso Telur', price: 25000 },
					{ name: 'Mi Ayam Bakso', price: 23000 },
				],
			][index];

			return menus.map((menu, menuIndex) => ({
				stallId: stall.id,
				name: menu.name,
				price: menu.price,
				isAvailable: menuIndex !== 2 || index !== 2,
			}));
		}),
	);

	const insertedReviews = await db
		.insert(reviews)
		.output()
		.values(
			insertedStalls.flatMap((stall, index) => [
				{
					stallId: stall.id,
					userId: customers[index % customers.length].id,
					rating: index === 2 ? 4 : 5,
					comment: 'Rasanya enak dan porsinya pas. Akan kembali lagi.',
					likeCount: 2,
					createdAt: now,
					updatedAt: now,
				},
				{
					stallId: stall.id,
					userId: customers[(index + 1) % customers.length].id,
					rating: index === 2 ? 4 : 5,
					comment: 'Pelayanan ramah, makanan datang dengan cepat.',
					likeCount: 2,
					createdAt: now,
					updatedAt: now,
				},
			]),
		);

	await db.insert(likes).values(
		insertedReviews.flatMap((review, index) => [
			{
				reviewId: review.id,
				userId: customers[(index + 2) % customers.length].id,
				createdAt: now,
			},
			{
				reviewId: review.id,
				userId: customers[(index + 3) % customers.length].id,
				createdAt: now,
			},
		]),
	);

	await db.insert(flags).values(
		insertedReviews.filter((_, index) => index % 2 === 0).map((review, index) => ({
			reviewId: review.id,
			reportedBy: customers[(index + 2) % customers.length].id,
			reason: 'Mohon tinjau kembali isi ulasan ini.',
			status: 'pending',
			createdAt: now,
		})),
	);

	await db.insert(auditLogs).values(
		insertedStalls.map((stall, index) => ({
			userId: owners[index].id,
			action: 'CREATE',
			targetTable: 'STALLS',
			targetId: stall.id,
			metadata: JSON.stringify({ name: stall.name, source: 'seed' }),
			createdAt: now,
		})),
	);

	console.log('Seeding selesai: 11 users, 5 stalls, 15 menu items, 10 reviews, 20 likes, 5 flags, 5 audit logs.');
}

seed().catch((error: unknown) => {
	console.error('Seeding gagal:', error);
	process.exitCode = 1;
});
