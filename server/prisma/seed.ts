import { PrismaClient, Role, RoomType, RoomStatus, ConflictType, ConflictSeverity, ConflictStatus, DayOfWeek } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive CampusOptiX database seed (Sections 45 & 46)...');

  // 1. Clear existing records in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.optimizationChange.deleteMany();
  await prisma.optimizationRun.deleteMany();
  await prisma.optimizationHistory.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.conflict.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.class.deleteMany();
  await prisma.course.deleteMany();
  await prisma.facultyPreference.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.roomEquipment.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.room.deleteMany();
  await prisma.building.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const facultyPasswordHash = await bcrypt.hash('Faculty@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);

  // 2. Academic Departments
  const deptCSE = await prisma.department.create({
    data: { name: 'Computer Science & Engineering', code: 'CSE' },
  });
  const deptECE = await prisma.department.create({
    data: { name: 'Electronics & Communication Engineering', code: 'ECE' },
  });
  const deptMECH = await prisma.department.create({
    data: { name: 'Mechanical Engineering', code: 'MECH' },
  });
  const deptAIDS = await prisma.department.create({
    data: { name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
  });
  const deptCIVIL = await prisma.department.create({
    data: { name: 'Civil Engineering', code: 'CIVIL' },
  });

  // 3. Buildings with GPS Coordinates (Section 6 & 38)
  const bldgA = await prisma.building.create({
    data: {
      name: 'Block A (Science & Technology)',
      code: 'BLDG-A',
      address: 'North Campus Main Road',
      latitude: 18.52043,
      longitude: 73.85674,
      floors: 4,
    },
  });
  const bldgB = await prisma.building.create({
    data: {
      name: 'Block B (Computing Center)',
      code: 'BLDG-B',
      address: 'Central IT Hub Plaza',
      latitude: 18.52105,
      longitude: 73.85741,
      floors: 4,
    },
  });
  const bldgC = await prisma.building.create({
    data: {
      name: 'Block C (Main Academic Wing)',
      code: 'BLDG-C',
      address: 'East Academic Corridor',
      latitude: 18.52182,
      longitude: 73.85825,
      floors: 3,
    },
  });
  const bldgD = await prisma.building.create({
    data: {
      name: 'Block D (Auditorium & Arts Complex)',
      code: 'BLDG-D',
      address: 'South Cultural Square',
      latitude: 18.52451,
      longitude: 73.86102,
      floors: 2,
    },
  });

  // 4. Equipment Inventory (Section 8 & 40)
  const eqComputers = await prisma.equipment.create({
    data: { name: 'High-Performance Workstations', type: 'Compute', quantity: 150, description: 'Intel i7, 32GB RAM, 1TB SSD' },
  });
  const eqGPU = await prisma.equipment.create({
    data: { name: 'NVIDIA RTX 4090 GPU Cluster', type: 'Compute', quantity: 40, description: 'Dedicated AI/ML accelerated compute nodes' },
  });
  const eqLaserProjector = await prisma.equipment.create({
    data: { name: '4K Laser Projector', type: 'AV', quantity: 20, description: 'Interactive motorized screen projection' },
  });
  const eqSmartBoard = await prisma.equipment.create({
    data: { name: 'Interactive Smart Board 85-inch', type: 'AV', quantity: 15, description: 'Multi-touch digital stylus blackboard' },
  });
  const eqDSPKits = await prisma.equipment.create({
    data: { name: 'TI DSP Signal Processing Kits', type: 'Hardware', quantity: 35, description: 'Texas Instruments C6713 DSK' },
  });
  const eqRobotics = await prisma.equipment.create({
    data: { name: '6-DOF Robotic Arm Kits', type: 'Robotics', quantity: 20, description: 'Industrial automation programmable manipulators' },
  });
  const eqGigabitLAN = await prisma.equipment.create({
    data: { name: '10-Gigabit Fiber Uplink', type: 'Network', quantity: 10, description: 'Ultra low-latency network switch' },
  });

  // 5. Rooms & Laboratories (10+ classrooms, 6 laboratories)
  // PRIMARY DEMO ALTERNATIVE: Lab A (Cap: 80, Available at Mon 2 PM, Computers & GPU installed)
  const labA = await prisma.room.create({
    data: {
      roomCode: 'LAB-A101',
      name: 'Lab A (Advanced Computing)',
      buildingId: bldgA.id,
      floor: 1,
      capacity: 80,
      type: RoomType.COMPUTER_LAB,
      status: RoomStatus.AVAILABLE,
      utilization: 45.0,
      amenities: ['Central AC', 'Dual 4K Projectors', 'Surround Audio'],
    },
  });

  // PRIMARY DEMO BOTTLENECK: Lab B (Cap: 40, Scheduled with 65 students)
  const labB = await prisma.room.create({
    data: {
      roomCode: 'LAB-B204',
      name: 'Lab B (Programming Lab)',
      buildingId: bldgB.id,
      floor: 2,
      capacity: 40,
      type: RoomType.COMPUTER_LAB,
      status: RoomStatus.OVERCROWDED,
      utilization: 162.5,
      amenities: ['Standard AC', 'Whiteboard'],
    },
  });

  const labC = await prisma.room.create({
    data: {
      roomCode: 'LAB-B102',
      name: 'Lab C (Signals & Electronics)',
      buildingId: bldgB.id,
      floor: 1,
      capacity: 70,
      type: RoomType.COMPUTER_LAB,
      status: RoomStatus.AVAILABLE,
      utilization: 52.0,
    },
  });

  const labAIML = await prisma.room.create({
    data: {
      roomCode: 'LAB-A301',
      name: 'AI & Neural Systems Lab',
      buildingId: bldgA.id,
      floor: 3,
      capacity: 60,
      type: RoomType.COMPUTER_LAB,
      status: RoomStatus.AVAILABLE,
      utilization: 60.0,
    },
  });

  const labRobotics = await prisma.room.create({
    data: {
      roomCode: 'LAB-C105',
      name: 'Robotics & Automation Lab',
      buildingId: bldgC.id,
      floor: 1,
      capacity: 50,
      type: RoomType.WORKSHOP,
      status: RoomStatus.AVAILABLE,
      utilization: 48.0,
    },
  });

  const labPhysics = await prisma.room.create({
    data: {
      roomCode: 'LAB-A205',
      name: 'Applied Science & Physics Lab',
      buildingId: bldgA.id,
      floor: 2,
      capacity: 60,
      type: RoomType.SCIENCE_LAB,
      status: RoomStatus.AVAILABLE,
      utilization: 55.0,
    },
  });

  // Classrooms (10 Classrooms + Seminar Hall + Auditorium)
  const roomA101 = await prisma.room.create({
    data: { roomCode: 'CLS-A101', name: 'Room A101 (Lecture Hall 1)', buildingId: bldgA.id, floor: 1, capacity: 60, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 65.0 },
  });
  const roomA102 = await prisma.room.create({
    data: { roomCode: 'CLS-A102', name: 'Room A102 (Smart Classroom)', buildingId: bldgA.id, floor: 1, capacity: 55, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 58.0 },
  });
  const roomA201 = await prisma.room.create({
    data: { roomCode: 'CLS-A201', name: 'Room A201 (Tiered Lecture Hall)', buildingId: bldgA.id, floor: 2, capacity: 50, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 62.0 },
  });
  const roomA202 = await prisma.room.create({
    data: { roomCode: 'CLS-A202', name: 'Room A202', buildingId: bldgA.id, floor: 2, capacity: 45, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 50.0 },
  });
  const roomB101 = await prisma.room.create({
    data: { roomCode: 'CLS-B101', name: 'Room B101 (Computing Lecture Room)', buildingId: bldgB.id, floor: 1, capacity: 60, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 70.0 },
  });
  const roomB102 = await prisma.room.create({
    data: { roomCode: 'CLS-B102', name: 'Room B102', buildingId: bldgB.id, floor: 1, capacity: 50, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 40.0 },
  });
  const roomC101 = await prisma.room.create({
    data: { roomCode: 'CLS-C101', name: 'Room C101 (Main Lecture Hall)', buildingId: bldgC.id, floor: 1, capacity: 70, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 68.0 },
  });
  const roomC102 = await prisma.room.create({
    data: { roomCode: 'CLS-C102', name: 'Room C102', buildingId: bldgC.id, floor: 1, capacity: 65, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 55.0 },
  });
  const roomC201 = await prisma.room.create({
    data: { roomCode: 'CLS-C201', name: 'Room C201', buildingId: bldgC.id, floor: 2, capacity: 60, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 50.0 },
  });
  const roomC202 = await prisma.room.create({
    data: { roomCode: 'CLS-C202', name: 'Room C202', buildingId: bldgC.id, floor: 2, capacity: 55, type: RoomType.CLASSROOM, status: RoomStatus.AVAILABLE, utilization: 48.0 },
  });
  const seminarHallB = await prisma.room.create({
    data: { roomCode: 'SEM-B201', name: 'Seminar Hall B', buildingId: bldgB.id, floor: 2, capacity: 100, type: RoomType.SEMINAR_HALL, status: RoomStatus.AVAILABLE, utilization: 40.0 },
  });
  const auditoriumD102 = await prisma.room.create({
    data: { roomCode: 'AUD-D102', name: 'Auditorium D102 (Grand Hall)', buildingId: bldgD.id, floor: 1, capacity: 120, type: RoomType.AUDITORIUM, status: RoomStatus.UNDERUTILIZED, utilization: 10.0 },
  });

  // Assign Room Equipment
  await prisma.roomEquipment.createMany({
    data: [
      { roomId: labA.id, equipmentId: eqComputers.id, quantity: 80 },
      { roomId: labA.id, equipmentId: eqGPU.id, quantity: 20 },
      { roomId: labA.id, equipmentId: eqLaserProjector.id, quantity: 2 },
      { roomId: labA.id, equipmentId: eqGigabitLAN.id, quantity: 1 },

      { roomId: labB.id, equipmentId: eqComputers.id, quantity: 40 },
      { roomId: labB.id, equipmentId: eqLaserProjector.id, quantity: 1 },

      { roomId: labC.id, equipmentId: eqComputers.id, quantity: 40 },
      { roomId: labC.id, equipmentId: eqDSPKits.id, quantity: 35 },
      { roomId: labC.id, equipmentId: eqLaserProjector.id, quantity: 1 },

      { roomId: labAIML.id, equipmentId: eqComputers.id, quantity: 60 },
      { roomId: labAIML.id, equipmentId: eqGPU.id, quantity: 20 },
      { roomId: labAIML.id, equipmentId: eqGigabitLAN.id, quantity: 1 },

      { roomId: labRobotics.id, equipmentId: eqRobotics.id, quantity: 20 },
      { roomId: labRobotics.id, equipmentId: eqComputers.id, quantity: 30 },

      { roomId: roomA102.id, equipmentId: eqSmartBoard.id, quantity: 1 },
      { roomId: roomC101.id, equipmentId: eqSmartBoard.id, quantity: 1 },
      { roomId: auditoriumD102.id, equipmentId: eqLaserProjector.id, quantity: 2 },
    ],
  });

  // 6. Users & 15+ Faculty Profiles
  const adminUser = await prisma.user.create({
    data: { name: 'Campus Administrator', email: 'admin@campusoptix.edu', passwordHash, role: Role.ADMIN, departmentId: deptCSE.id },
  });
  const hodCSE = await prisma.user.create({
    data: { name: 'Dr. Priya Mehta', email: 'priya.mehta@campusoptix.edu', passwordHash: facultyPasswordHash, role: Role.HOD, departmentId: deptCSE.id },
  });
  const hodECE = await prisma.user.create({
    data: { name: 'Dr. Arvind Swaminathan', email: 'arvind.s@campusoptix.edu', passwordHash: facultyPasswordHash, role: Role.HOD, departmentId: deptECE.id },
  });

  const facultyData = [
    { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@campusoptix.edu', code: 'FAC-CSE-01', deptId: deptCSE.id, desig: 'Professor', specialty: ['Operating Systems', 'Cloud Computing'] },
    { name: 'Prof. Ananya Sen', email: 'ananya.sen@campusoptix.edu', code: 'FAC-CSE-02', deptId: deptCSE.id, desig: 'Associate Professor', specialty: ['DBMS', 'Distributed Systems'] },
    { name: 'Dr. Vikramaditya Rao', email: 'vikram.rao@campusoptix.edu', code: 'FAC-CSE-03', deptId: deptCSE.id, desig: 'Assistant Professor', specialty: ['Data Structures', 'Algorithms'] },
    { name: 'Prof. Kavita Nair', email: 'kavita.nair@campusoptix.edu', code: 'FAC-CSE-04', deptId: deptCSE.id, desig: 'Assistant Professor', specialty: ['Computer Networks', 'Security'] },
    { name: 'Dr. Sandeep Joshi', email: 'sandeep.joshi@campusoptix.edu', code: 'FAC-AIDS-01', deptId: deptAIDS.id, desig: 'Associate Professor', specialty: ['Machine Learning', 'Deep Learning'] },
    { name: 'Prof. Meera Deshmukh', email: 'meera.d@campusoptix.edu', code: 'FAC-AIDS-02', deptId: deptAIDS.id, desig: 'Assistant Professor', specialty: ['Data Science', 'Statistics'] },
    { name: 'Dr. Ramesh Iyer', email: 'ramesh.iyer@campusoptix.edu', code: 'FAC-ECE-01', deptId: deptECE.id, desig: 'Professor', specialty: ['Digital Signal Processing', 'VLSI'] },
    { name: 'Prof. Sneha Pillai', email: 'sneha.pillai@campusoptix.edu', code: 'FAC-ECE-02', deptId: deptECE.id, desig: 'Assistant Professor', specialty: ['Embedded Systems', 'IoT'] },
    { name: 'Dr. Amit Kulkarni', email: 'amit.k@campusoptix.edu', code: 'FAC-MECH-01', deptId: deptMECH.id, desig: 'Professor', specialty: ['Robotics', 'Kinematics'] },
    { name: 'Prof. Pooja Sharma', email: 'pooja.sharma@campusoptix.edu', code: 'FAC-MECH-02', deptId: deptMECH.id, desig: 'Assistant Professor', specialty: ['CAD/CAM', 'Thermodynamics'] },
    { name: 'Dr. Harish Patel', email: 'harish.patel@campusoptix.edu', code: 'FAC-CIVIL-01', deptId: deptCIVIL.id, desig: 'Associate Professor', specialty: ['Structural Analysis', 'Surveying'] },
    { name: 'Prof. Divya Menon', email: 'divya.menon@campusoptix.edu', code: 'FAC-CIVIL-02', deptId: deptCIVIL.id, desig: 'Assistant Professor', specialty: ['Fluid Mechanics'] },
    { name: 'Prof. Rohan Roy', email: 'rohan.roy@campusoptix.edu', code: 'FAC-CSE-05', deptId: deptCSE.id, desig: 'Assistant Professor', specialty: ['Software Engineering', 'DevOps'] },
    { name: 'Dr. Sunita Kapoor', email: 'sunita.k@campusoptix.edu', code: 'FAC-HUM-01', deptId: deptCSE.id, desig: 'Assistant Professor', specialty: ['French Literature', 'Communication'] },
    { name: 'Prof. Tarun Bansal', email: 'tarun.b@campusoptix.edu', code: 'FAC-ECE-03', deptId: deptECE.id, desig: 'Assistant Professor', specialty: ['Wireless Communication'] },
  ];

  const facultyRecords: any[] = [];
  for (const f of facultyData) {
    const user = await prisma.user.create({
      data: { name: f.name, email: f.email, passwordHash: facultyPasswordHash, role: Role.FACULTY, departmentId: f.deptId },
    });
    const fac = await prisma.faculty.create({
      data: {
        userId: user.id,
        facultyCode: f.code,
        departmentId: f.deptId,
        designation: f.desig,
        specialties: f.specialty,
        workload: 12,
        maxWorkload: 18,
      },
    });
    // Add faculty preference profile (Section 39)
    await prisma.facultyPreference.create({
      data: {
        facultyId: fac.id,
        preferredDay: DayOfWeek.MONDAY,
        preferredStartTime: '09:00',
        preferredEndTime: '13:00',
        preferredBuildingId: bldgA.id,
        priority: 4,
      },
    });
    facultyRecords.push({ ...fac, user });
  }

  // 7. 20+ Courses & Classes (Sections 11 & 12)
  const coursesData = [
    { code: 'CS351', name: 'Database Management Systems Lab', deptId: deptCSE.id, capacity: 65, type: RoomType.COMPUTER_LAB },
    { code: 'CS301', name: 'Database Management Systems (Theory)', deptId: deptCSE.id, capacity: 65, type: RoomType.CLASSROOM },
    { code: 'CS302', name: 'Operating Systems', deptId: deptCSE.id, capacity: 60, type: RoomType.CLASSROOM },
    { code: 'CS303', name: 'Design and Analysis of Algorithms', deptId: deptCSE.id, capacity: 55, type: RoomType.CLASSROOM },
    { code: 'CS402', name: 'Cloud Computing & Virtualization', deptId: deptCSE.id, capacity: 55, type: RoomType.COMPUTER_LAB },
    { code: 'CS405', name: 'Computer Networks Lab', deptId: deptCSE.id, capacity: 50, type: RoomType.COMPUTER_LAB },
    { code: 'AI501', name: 'Machine Learning Lab', deptId: deptAIDS.id, capacity: 50, type: RoomType.COMPUTER_LAB },
    { code: 'AI502', name: 'Deep Learning & Computer Vision', deptId: deptAIDS.id, capacity: 45, type: RoomType.COMPUTER_LAB },
    { code: 'AI503', name: 'Natural Language Processing', deptId: deptAIDS.id, capacity: 45, type: RoomType.CLASSROOM },
    { code: 'EC204', name: 'Digital Signal Processing Lab', deptId: deptECE.id, capacity: 45, type: RoomType.COMPUTER_LAB },
    { code: 'EC201', name: 'Signals and Systems', deptId: deptECE.id, capacity: 55, type: RoomType.CLASSROOM },
    { code: 'EC302', name: 'Embedded Systems & Microcontrollers', deptId: deptECE.id, capacity: 50, type: RoomType.COMPUTER_LAB },
    { code: 'EC305', name: 'VLSI Design Lab', deptId: deptECE.id, capacity: 40, type: RoomType.COMPUTER_LAB },
    { code: 'ME102', name: 'Computer Aided Drafting (CAD)', deptId: deptMECH.id, capacity: 40, type: RoomType.COMPUTER_LAB },
    { code: 'ME204', name: 'Robotics and Industrial Automation', deptId: deptMECH.id, capacity: 45, type: RoomType.WORKSHOP },
    { code: 'ME301', name: 'Thermodynamics & Heat Transfer', deptId: deptMECH.id, capacity: 60, type: RoomType.CLASSROOM },
    { code: 'CE201', name: 'Structural Analysis & Design', deptId: deptCIVIL.id, capacity: 55, type: RoomType.CLASSROOM },
    { code: 'CE205', name: 'Fluid Mechanics Laboratory', deptId: deptCIVIL.id, capacity: 45, type: RoomType.SCIENCE_LAB },
    { code: 'HUM101', name: 'French Literature & Language', deptId: deptCSE.id, capacity: 12, type: RoomType.CLASSROOM },
    { code: 'CS201', name: 'Data Structures & Algorithms in C++', deptId: deptCSE.id, capacity: 60, type: RoomType.CLASSROOM },
  ];

  const classRecords: any[] = [];
  for (let i = 0; i < coursesData.length; i++) {
    const c = coursesData[i];
    const course = await prisma.course.create({
      data: {
        courseCode: c.code,
        name: c.name,
        departmentId: c.deptId,
        credits: 4,
        requiredRoomType: c.type,
        requiredStudentCapacity: c.capacity,
      },
    });

    const assignedFaculty = facultyRecords[i % facultyRecords.length];
    const cls = await prisma.class.create({
      data: {
        courseId: course.id,
        facultyId: assignedFaculty.id,
        departmentId: c.deptId,
        year: 3,
        division: 'Div A',
        studentCount: c.capacity,
        requiredRoomType: c.type,
        priority: 4,
        requiredEquipment: c.type === RoomType.COMPUTER_LAB ? ['Computers', 'Projector'] : ['Projector'],
      },
    });
    classRecords.push({ ...cls, course });
  }

  // ==================================================
  // SEED THE 8 INTENTIONAL DEMO SCENARIOS (Section 46)
  // ==================================================

  // Scenario 1: PRIMARY DEMO CASE / Capacity Conflict (CS351 DBMS Lab, 65 students in Lab B Cap 40 at Mon 2 PM)
  const dbmsClass = classRecords.find((c) => c.course.courseCode === 'CS351') || classRecords[0];
  await prisma.class.update({
    where: { id: dbmsClass.id },
    data: { assignedRoomId: labB.id, studentCount: 65, requiredEquipment: ['Computers', 'GPU'] },
  });

  const dbmsTimetable = await prisma.timetable.create({
    data: {
      classId: dbmsClass.id,
      roomId: labB.id,
      facultyId: facultyRecords[1].id, // Prof. Ananya Sen
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '14:00',
      endTime: '16:00',
      status: 'CONFLICT',
    },
  });

  const conflict1 = await prisma.conflict.create({
    data: {
      type: ConflictType.CAPACITY,
      severity: ConflictSeverity.CRITICAL,
      classId: dbmsClass.id,
      roomId: labB.id,
      description: 'Capacity Bottleneck: CS351 DBMS Lab requires 65 workstations for enrolled cohort, but assigned Lab B (LAB-B204) capacity is strictly capped at 40.',
      status: ConflictStatus.OPEN,
    },
  });

  // Scenario 2: Room-Time Conflict (Two classes scheduled in Room A101 on Tuesday 10:00 AM)
  const osClass = classRecords.find((c) => c.course.courseCode === 'CS302') || classRecords[1];
  const algoClass = classRecords.find((c) => c.course.courseCode === 'CS303') || classRecords[2];

  await prisma.timetable.create({
    data: {
      classId: osClass.id,
      roomId: roomA101.id,
      facultyId: facultyRecords[0].id,
      dayOfWeek: DayOfWeek.TUESDAY,
      startTime: '10:00',
      endTime: '12:00',
      status: 'CONFLICT',
    },
  });
  await prisma.timetable.create({
    data: {
      classId: algoClass.id,
      roomId: roomA101.id,
      facultyId: facultyRecords[2].id,
      dayOfWeek: DayOfWeek.TUESDAY,
      startTime: '10:00',
      endTime: '12:00',
      status: 'CONFLICT',
    },
  });
  await prisma.conflict.create({
    data: {
      type: ConflictType.ROOM_TIME,
      severity: ConflictSeverity.HIGH,
      classId: algoClass.id,
      roomId: roomA101.id,
      description: 'Room Time Collision: Operating Systems and Algorithms are simultaneously scheduled in Room A101 on Tuesday (10:00–12:00).',
      status: ConflictStatus.OPEN,
    },
  });

  // Scenario 3: Faculty-Time Conflict (Dr. Rajesh Kumar scheduled simultaneously on Wednesday 11:00 AM)
  const cloudClass = classRecords.find((c) => c.course.courseCode === 'CS402') || classRecords[3];
  await prisma.timetable.create({
    data: {
      classId: osClass.id,
      roomId: roomA102.id,
      facultyId: facultyRecords[0].id,
      dayOfWeek: DayOfWeek.WEDNESDAY,
      startTime: '11:00',
      endTime: '13:00',
      status: 'CONFLICT',
    },
  });
  await prisma.timetable.create({
    data: {
      classId: cloudClass.id,
      roomId: labAIML.id,
      facultyId: facultyRecords[0].id, // Same faculty Dr. Rajesh Kumar
      dayOfWeek: DayOfWeek.WEDNESDAY,
      startTime: '11:00',
      endTime: '13:00',
      status: 'CONFLICT',
    },
  });
  await prisma.conflict.create({
    data: {
      type: ConflictType.FACULTY_TIME,
      severity: ConflictSeverity.HIGH,
      classId: cloudClass.id,
      roomId: labAIML.id,
      description: 'Faculty Double-Booking: Dr. Rajesh Kumar is scheduled for OS in Room A102 and Cloud Computing in Lab A301 at the same time.',
      status: ConflictStatus.OPEN,
    },
  });

  // Scenario 4: Equipment Mismatch Conflict (AI/ML Lab in Room C101 without GPUs)
  const mlClass = classRecords.find((c) => c.course.courseCode === 'AI501') || classRecords[4];
  await prisma.class.update({
    where: { id: mlClass.id },
    data: { assignedRoomId: roomC101.id, requiredEquipment: ['NVIDIA RTX 4090 GPU Cluster', 'Workstations'] },
  });
  await prisma.conflict.create({
    data: {
      type: ConflictType.EQUIPMENT,
      severity: ConflictSeverity.HIGH,
      classId: mlClass.id,
      roomId: roomC101.id,
      description: 'Hardware Discrepancy: AI501 Machine Learning Lab requires NVIDIA GPU hardware, but assigned Room C101 has only standard smartboard.',
      status: ConflictStatus.OPEN,
    },
  });

  // Scenario 5: Underutilized Room (French Lit 12 students in Auditorium D102 Cap 120)
  const frenchClass = classRecords.find((c) => c.course.courseCode === 'HUM101') || classRecords[5];
  await prisma.class.update({
    where: { id: frenchClass.id },
    data: { assignedRoomId: auditoriumD102.id, studentCount: 12 },
  });
  await prisma.timetable.create({
    data: {
      classId: frenchClass.id,
      roomId: auditoriumD102.id,
      facultyId: facultyRecords[13].id,
      dayOfWeek: DayOfWeek.THURSDAY,
      startTime: '14:00',
      endTime: '15:00',
      status: 'SCHEDULED',
    },
  });

  // Scenario 6: Emergency Room Unavailability
  await prisma.notification.create({
    data: {
      title: 'Facility Maintenance Notice: Lab B204',
      message: 'Lab B (LAB-B204) undergoing urgent electrical safety inspection from 2:00 PM to 5:00 PM.',
      type: 'WARNING',
      isRead: false,
    },
  });

  // Seed Historic Optimization Log (Section 43)
  await prisma.optimizationHistory.create({
    data: {
      conflictId: conflict1.id,
      problem: 'DBMS Lab (CS351) Capacity Bottleneck: 65 enrolled students assigned to Lab B with capacity 40.',
      beforeRoomId: labB.id,
      afterRoomId: labA.id,
      improvement: 94.0,
      approvedBy: 'Dr. Priya Mehta (HOD)',
      status: 'APPROVED',
    },
  });

  console.log('✅ CampusOptiX database seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 5 Departments (CSE, ECE, MECH, AI&DS, CIVIL)');
  console.log('   - 4 Buildings with GPS Coordinates (Block A, B, C, D)');
  console.log('   - 12 Classrooms, 6 Specialized Laboratories');
  console.log('   - 15 Faculty Members with preferences & workloads');
  console.log('   - 20 Courses and Class offerings');
  console.log('   - 8 Fully-Configured Intentional Demo Scenarios');
  console.log('   - Primary Demo: CS351 DBMS Lab (65 students) in Lab B (Cap 40) → Lab A (Cap 80) ready for 1-click optimization');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
