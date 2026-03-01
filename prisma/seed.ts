// prisma/seed.ts
// 既存の demo-data.ts をDBに投入するシードスクリプト
// 実行: npx prisma db seed

import 'dotenv/config';
import { PrismaClient, MemberStatus, VisitMethod, Trend } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // 1. テナント (A-1 EXPRESS つつじヶ丘店)
  // ============================================================
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant_a1express_tsutsuji' },
    update: {},
    create: {
      id: 'tenant_a1express_tsutsuji',
      name: 'A-1 EXPRESS',
      branch: 'つつじヶ丘店',
      features: ['24H営業', 'セルフ型', 'マシン特化', '全店舗利用可'],
      lineAccountName: 'A-1 EXPRESS つつじヶ丘',
    },
  });
  console.log(`  ✅ Tenant: ${tenant.name} ${tenant.branch}`);

  // ============================================================
  // 2. 料金プラン
  // ============================================================
  const planSingle = await prisma.plan.upsert({
    where: { id: 'plan_single' },
    update: {},
    create: {
      id: 'plan_single',
      tenantId: tenant.id,
      name: '単店会員',
      fee: 5940,
    },
  });

  const planRegular = await prisma.plan.upsert({
    where: { id: 'plan_regular' },
    update: {},
    create: {
      id: 'plan_regular',
      tenantId: tenant.id,
      name: 'レギュラー',
      fee: 6985,
    },
  });
  console.log(`  ✅ Plans: ${planSingle.name} (¥${planSingle.fee}), ${planRegular.name} (¥${planRegular.fee})`);

  // ============================================================
  // 3. 会員データ (8名)
  // demo-data.ts の会員をDB形式に変換
  // ============================================================
  const membersData = [
    {
      id: 'member_01',
      name: '田中 太郎',
      age: 32,
      planId: planRegular.id,
      joinDate: new Date('2025-06-15'),
      status: MemberStatus.ACTIVE,
      riskScore: 15,
      trend: Trend.DOWN,
      visitsThisMonth: 12,
      visitsLastMonth: 10,
      avgVisits: 11,
      daysSinceLastVisit: 1,
    },
    {
      id: 'member_02',
      name: '佐藤 花子',
      age: 28,
      planId: planSingle.id,
      joinDate: new Date('2025-08-01'),
      status: MemberStatus.ACTIVE,
      riskScore: 45,
      trend: Trend.UP,
      visitsThisMonth: 5,
      visitsLastMonth: 8,
      avgVisits: 7,
      daysSinceLastVisit: 5,
    },
    {
      id: 'member_03',
      name: '鈴木 一郎',
      age: 45,
      planId: planRegular.id,
      joinDate: new Date('2025-04-10'),
      status: MemberStatus.ACTIVE,
      riskScore: 78,
      trend: Trend.UP,
      visitsThisMonth: 2,
      visitsLastMonth: 7,
      avgVisits: 8,
      daysSinceLastVisit: 14,
    },
    {
      id: 'member_04',
      name: '高橋 美咲',
      age: 24,
      planId: planSingle.id,
      joinDate: new Date('2025-09-20'),
      status: MemberStatus.ACTIVE,
      riskScore: 8,
      trend: Trend.STABLE,
      visitsThisMonth: 15,
      visitsLastMonth: 14,
      avgVisits: 14,
      daysSinceLastVisit: 0,
    },
    {
      id: 'member_05',
      name: '渡辺 健太',
      age: 38,
      planId: planRegular.id,
      joinDate: new Date('2025-03-05'),
      status: MemberStatus.ACTIVE,
      riskScore: 92,
      trend: Trend.UP,
      visitsThisMonth: 1,
      visitsLastMonth: 4,
      avgVisits: 9,
      daysSinceLastVisit: 21,
    },
    {
      id: 'member_06',
      name: '伊藤 さくら',
      age: 30,
      planId: planSingle.id,
      joinDate: new Date('2025-07-12'),
      status: MemberStatus.ACTIVE,
      riskScore: 35,
      trend: Trend.STABLE,
      visitsThisMonth: 7,
      visitsLastMonth: 8,
      avgVisits: 8,
      daysSinceLastVisit: 3,
    },
    {
      id: 'member_07',
      name: '山本 大輔',
      age: 52,
      planId: planRegular.id,
      joinDate: new Date('2025-01-20'),
      status: MemberStatus.ACTIVE,
      riskScore: 60,
      trend: Trend.UP,
      visitsThisMonth: 3,
      visitsLastMonth: 6,
      avgVisits: 7,
      daysSinceLastVisit: 10,
    },
    {
      id: 'member_08',
      name: '中村 優子',
      age: 27,
      planId: planSingle.id,
      joinDate: new Date('2025-10-01'),
      status: MemberStatus.ACTIVE,
      riskScore: 95,
      trend: Trend.UP,
      visitsThisMonth: 0,
      visitsLastMonth: 3,
      avgVisits: 5,
      daysSinceLastVisit: 35,
    },
  ];

  for (const m of membersData) {
    const member = await prisma.member.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        tenantId: tenant.id,
        planId: m.planId,
        name: m.name,
        age: m.age,
        joinDate: m.joinDate,
        status: m.status,
      },
    });

    // リスクスナップショット
    await prisma.riskSnapshot.create({
      data: {
        tenantId: tenant.id,
        memberId: member.id,
        riskScore: m.riskScore,
        trend: m.trend,
        factors: {
          visitsThisMonth: m.visitsThisMonth,
          visitsLastMonth: m.visitsLastMonth,
          avgVisits: m.avgVisits,
          daysSinceLastVisit: m.daysSinceLastVisit,
        },
      },
    });

    // 来館記録を生成 (過去30日分のダミーデータ)
    const now = new Date();
    for (let day = 0; day < 30; day++) {
      // 来館確率をリスクスコアに反比例させる
      const visitProbability = (100 - m.riskScore) / 100 * 0.5;
      if (Math.random() < visitProbability) {
        const visitDate = new Date(now);
        visitDate.setDate(visitDate.getDate() - day);
        visitDate.setHours(Math.floor(Math.random() * 14) + 6, Math.floor(Math.random() * 60));
        await prisma.visit.create({
          data: {
            tenantId: tenant.id,
            memberId: member.id,
            visitedAt: visitDate,
            method: VisitMethod.QR_CODE,
          },
        });
      }
    }

    // QRコード生成
    await prisma.qrCode.upsert({
      where: { memberId: member.id },
      update: {},
      create: {
        tenantId: tenant.id,
        memberId: member.id,
        code: `qr_${member.id}_${Date.now()}`,
      },
    });
  }
  console.log(`  ✅ Members: ${membersData.length} members with visits and QR codes`);

  // ============================================================
  // 4. 月次統計 (6ヶ月分)
  // ============================================================
  const monthlyData = [
    { month: '2025-10-01', totalMembers: 180, newMembers: 15, churnedMembers: 12, churnRate: 0.067, totalVisits: 2100 },
    { month: '2025-11-01', totalMembers: 183, newMembers: 18, churnedMembers: 15, churnRate: 0.082, totalVisits: 1950 },
    { month: '2025-12-01', totalMembers: 186, newMembers: 20, churnedMembers: 14, churnRate: 0.075, totalVisits: 1800 },
    { month: '2026-01-01', totalMembers: 192, newMembers: 25, churnedMembers: 10, churnRate: 0.052, totalVisits: 2400 },
    { month: '2026-02-01', totalMembers: 207, newMembers: 22, churnedMembers: 18, churnRate: 0.087, totalVisits: 2200 },
    { month: '2026-03-01', totalMembers: 211, newMembers: 16, churnedMembers: 8, churnRate: 0.038, totalVisits: 2350 },
  ];

  for (const stat of monthlyData) {
    await prisma.monthlyStat.upsert({
      where: {
        tenantId_month: { tenantId: tenant.id, month: new Date(stat.month) },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        month: new Date(stat.month),
        totalMembers: stat.totalMembers,
        newMembers: stat.newMembers,
        churnedMembers: stat.churnedMembers,
        churnRate: stat.churnRate,
        totalVisits: stat.totalVisits,
      },
    });
  }
  console.log(`  ✅ Monthly stats: ${monthlyData.length} months`);

  // ============================================================
  // 5. リテンション施策ルール (4種)
  // ============================================================
  const rules = [
    {
      name: '休眠会員フォロー',
      description: '14日以上来館がない会員に自動メッセージ',
      triggerCondition: { type: 'days_since_last_visit', threshold: 14 },
      messageTemplate: '{{name}}さん、最近ジムに来れていませんか？お身体の調子はいかがですか？またお待ちしています💪',
      isActive: true,
    },
    {
      name: '高リスク会員アラート',
      description: 'リスクスコア80以上の会員にクーポン配信',
      triggerCondition: { type: 'risk_threshold', minScore: 80 },
      messageTemplate: '{{name}}さん限定！今月中のご来館で次月会費10%OFF🎉',
      isActive: true,
    },
    {
      name: '来館頻度低下通知',
      description: '前月比50%以下の来館頻度低下を検知',
      triggerCondition: { type: 'visit_drop', dropRate: 0.5 },
      messageTemplate: '{{name}}さん、新しいトレーニングメニューをご用意しました！ぜひ試してみてください🏋️',
      isActive: true,
    },
    {
      name: '入会1ヶ月フォロー',
      description: '入会から30日経過した新規会員にフォローアップ',
      triggerCondition: { type: 'days_since_join', threshold: 30 },
      messageTemplate: '{{name}}さん、入会1ヶ月おめでとうございます🎊 トレーニングは順調ですか？何かお困りのことがあればお気軽にどうぞ！',
      isActive: false,
    },
  ];

  for (const rule of rules) {
    await prisma.retentionRule.create({
      data: {
        tenantId: tenant.id,
        ...rule,
      },
    });
  }
  console.log(`  ✅ Retention rules: ${rules.length} rules`);

  // ============================================================
  // 6. 管理ユーザー (テスト用)
  // ============================================================
  await prisma.user.upsert({
    where: { email: 'demo@churnguard.app' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'demo@churnguard.app',
      name: 'デモ管理者',
      role: 'OWNER',
    },
  });
  console.log('  ✅ Demo user: demo@churnguard.app');

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
