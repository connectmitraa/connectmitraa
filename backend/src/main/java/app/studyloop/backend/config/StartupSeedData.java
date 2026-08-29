package app.studyloop.backend.config;

import app.studyloop.backend.domain.AdminUser;
import app.studyloop.backend.domain.CollegeExamCalendar;
import app.studyloop.backend.domain.Profile;
import app.studyloop.backend.domain.Reel;
import app.studyloop.backend.domain.ReelComment;
import app.studyloop.backend.repository.AdminUserRepository;
import app.studyloop.backend.repository.CollegeExamCalendarRepository;
import app.studyloop.backend.repository.ProfileRepository;
import app.studyloop.backend.repository.ReelRepository;
import app.studyloop.backend.repository.ReelCommentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

@Component
public class StartupSeedData implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final ProfileRepository profileRepository;
    private final CollegeExamCalendarRepository examCalendarRepository;
    private final app.studyloop.backend.repository.UserFollowRepository userFollowRepository;
    private final ReelRepository reelRepository;
    private final ReelCommentRepository reelCommentRepository;

    public StartupSeedData(AdminUserRepository adminUserRepository,
                           ProfileRepository profileRepository,
                           CollegeExamCalendarRepository examCalendarRepository,
                           app.studyloop.backend.repository.UserFollowRepository userFollowRepository,
                           ReelRepository reelRepository,
                           ReelCommentRepository reelCommentRepository) {
        this.adminUserRepository = adminUserRepository;
        this.profileRepository = profileRepository;
        this.examCalendarRepository = examCalendarRepository;
        this.userFollowRepository = userFollowRepository;
        this.reelRepository = reelRepository;
        this.reelCommentRepository = reelCommentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdminUsers();
        seedStudentProfiles();
        seedUserFollows();
        seedExamCalendar();
        seedReels();
    }

    private void seedAdminUsers() {
        if (adminUserRepository.count() == 0) {
            // Seed a few default administrator emails
            AdminUser devAdmin = AdminUser.builder()
                    .email("admin@studyloop.app")
                    .role("super_admin")
                    .createdAt(Instant.now())
                    .build();

            AdminUser demoAdmin = AdminUser.builder()
                    .email("admin@student.com")
                    .role("moderator")
                    .createdAt(Instant.now())
                    .build();

            adminUserRepository.save(devAdmin);
            adminUserRepository.save(demoAdmin);
            System.out.println("Seeded default admin accounts: admin@studyloop.app, admin@student.com");
        }
    }

    private void seedStudentProfiles() {
        if (profileRepository.count() == 0) {
            // Seed a few student profiles designed for matchmaking
            
            // Student A (Viewer): Wants to learn React, can teach Java
            Profile studentA = Profile.builder()
                    .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                    .email("studenta@student.com")
                    .fullName("Aarav Sharma")
                    .college("IIT Madras")
                    .department("Computer Science")
                    .year(2)
                    .bio("CS sophomore. Love systems programming and backend engineering.")
                    .skills(Arrays.asList("Java", "Spring Boot", "SQL"))
                    .teachingSkills(Arrays.asList("Java", "Spring Boot"))
                    .learningGoals(Arrays.asList("React", "WebRTC"))
                    .xp(120)
                    .level("Beginner")
                    .reputation(new BigDecimal("4.80"))
                    .streak(3)
                    .createdAt(Instant.now())
                    .build();
            studentA.setGender("male");

            // Student B (Perfect Skill Swap match! Wants to learn Java, can teach React)
            Profile studentB = Profile.builder()
                    .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                    .email("studentb@student.com")
                    .fullName("Bhavna Patel")
                    .college("IIT Madras")
                    .department("Computer Science")
                    .year(2)
                    .bio("Frontend enthusiast. React developer. Looking to learn backend APIs.")
                    .skills(Arrays.asList("React", "JavaScript", "HTML/CSS"))
                    .teachingSkills(Arrays.asList("React", "JavaScript"))
                    .learningGoals(Arrays.asList("Java", "Spring Boot"))
                    .xp(240)
                    .level("Intermediate")
                    .reputation(new BigDecimal("4.95"))
                    .streak(5)
                    .createdAt(Instant.now())
                    .build();
            studentB.setGender("female");

            // Student C (Senior Mentor: Year 4, can teach WebRTC, wants to learn ML)
            Profile studentC = Profile.builder()
                    .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                    .email("studentc@student.com")
                    .fullName("Chaitanya Reddy")
                    .college("IIT Madras")
                    .department("Information Technology")
                    .year(4)
                    .bio("Final year student. Built several WebRTC caller tools. Ask me anything.")
                    .skills(Arrays.asList("React", "WebRTC", "NodeJS"))
                    .teachingSkills(Arrays.asList("WebRTC", "NodeJS"))
                    .learningGoals(Collections.singletonList("Machine Learning"))
                    .xp(680)
                    .level("Expert")
                    .reputation(new BigDecimal("4.90"))
                    .streak(12)
                    .createdAt(Instant.now())
                    .build();
            studentC.setGender("male");

            profileRepository.save(studentA);
            profileRepository.save(studentB);
            profileRepository.save(studentC);
            System.out.println("Seeded student profiles (Aarav, Bhavna, Chaitanya) at IIT Madras");
        }
    }

    private void seedUserFollows() {
        if (userFollowRepository.count() == 0) {
            UUID aaravId = UUID.fromString("11111111-1111-1111-1111-111111111111");
            UUID bhavnaId = UUID.fromString("22222222-2222-2222-2222-222222222222");
            UUID chaitanyaId = UUID.fromString("33333333-3333-3333-3333-333333333333");

            // Aarav follows Bhavna & Chaitanya
            userFollowRepository.save(app.studyloop.backend.domain.UserFollow.builder().followerId(aaravId).followingId(bhavnaId).build());
            userFollowRepository.save(app.studyloop.backend.domain.UserFollow.builder().followerId(aaravId).followingId(chaitanyaId).build());

            // Bhavna follows Aarav
            userFollowRepository.save(app.studyloop.backend.domain.UserFollow.builder().followerId(bhavnaId).followingId(aaravId).build());

            // Chaitanya follows Aarav & Bhavna
            userFollowRepository.save(app.studyloop.backend.domain.UserFollow.builder().followerId(chaitanyaId).followingId(aaravId).build());
            userFollowRepository.save(app.studyloop.backend.domain.UserFollow.builder().followerId(chaitanyaId).followingId(bhavnaId).build());

            System.out.println("Seeded user follow relationships between Aarav, Bhavna, and Chaitanya");
        }
    }

    private void seedExamCalendar() {
        if (examCalendarRepository.count() == 0) {
            // Seed upcoming exams to trigger Exam Radar boost (+35)
            // Aarav wants to learn React, there's a React exam in 4 days!
            CollegeExamCalendar reactExam = CollegeExamCalendar.builder()
                    .college("IIT Madras")
                    .subject("React")
                    .examDate(LocalDate.now().plusDays(4))
                    .build();

            CollegeExamCalendar javaExam = CollegeExamCalendar.builder()
                    .college("IIT Madras")
                    .subject("Java")
                    .examDate(LocalDate.now().plusDays(6))
                    .build();

            examCalendarRepository.save(reactExam);
            examCalendarRepository.save(javaExam);
            System.out.println("Seeded upcoming exams calendar for IIT Madras (React, Java)");
        }
    }

    private void seedReels() {
        if (reelRepository.count() == 0) {
            UUID aaravId = UUID.fromString("11111111-1111-1111-1111-111111111111");
            UUID bhavnaId = UUID.fromString("22222222-2222-2222-2222-222222222222");
            UUID chaitanyaId = UUID.fromString("33333333-3333-3333-3333-333333333333");

            Reel reel1 = Reel.builder()
                    .creatorId(aaravId)
                    .videoUrl("https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4")
                    .description("3 Tricks to solve Recursion Tree problems fast in Java ⚡ #Algorithms #Java")
                    .subject("Algorithms")
                    .likesCount(154)
                    .commentsCount(2)
                    .createdAt(Instant.now().minusSeconds(3600 * 2))
                    .build();

            Reel reel2 = Reel.builder()
                    .creatorId(bhavnaId)
                    .videoUrl("https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4")
                    .description("How Spring Boot Inversion of Control & @Autowired work under 60s ☕ #SpringBoot")
                    .subject("SpringBoot")
                    .likesCount(218)
                    .commentsCount(1)
                    .createdAt(Instant.now().minusSeconds(3600))
                    .build();

            Reel reel3 = Reel.builder()
                    .creatorId(chaitanyaId)
                    .videoUrl("https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4")
                    .description("Visualizing Gradient Descent & Contour Cost Surfaces in 3D 📐 #MachineLearning")
                    .subject("MachineLearning")
                    .likesCount(312)
                    .commentsCount(1)
                    .createdAt(Instant.now())
                    .build();

            reelRepository.save(reel1);
            reelRepository.save(reel2);
            reelRepository.save(reel3);

            // Comments for Reel 1 (Aarav's reel)
            ReelComment c1 = ReelComment.builder()
                    .reelId(reel1.getId())
                    .userId(bhavnaId)
                    .comment("This helper tree recursion trick saved me in midterms! 🔥")
                    .createdAt(Instant.now().minusSeconds(3600 * 2 - 100))
                    .build();

            ReelComment c2 = ReelComment.builder()
                    .reelId(reel1.getId())
                    .userId(chaitanyaId)
                    .comment("Clean breakdown. Can you do Dynamic Programming memoization next?")
                    .createdAt(Instant.now().minusSeconds(3600 * 2 - 200))
                    .build();

            // Comments for Reel 2 (Bhavna's reel)
            ReelComment c3 = ReelComment.builder()
                    .reelId(reel2.getId())
                    .userId(aaravId)
                    .comment("Best 60-second explanation of ApplicationContext!")
                    .createdAt(Instant.now().minusSeconds(3600 - 100))
                    .build();

            // Comments for Reel 3 (Chaitanya's reel)
            ReelComment c4 = ReelComment.builder()
                    .reelId(reel3.getId())
                    .userId(aaravId)
                    .comment("The learning rate oscillation visual was super clear.")
                    .createdAt(Instant.now().minusSeconds(50))
                    .build();

            reelCommentRepository.saveAll(Arrays.asList(c1, c2, c3, c4));
            System.out.println("Seeded default reels and comments for Aarav, Bhavna, and Chaitanya");
        }
    }
}
