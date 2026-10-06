package app.studyloop.backend.controller;

import app.studyloop.backend.domain.Profile;
import app.studyloop.backend.dto.FeedItemDto;
import app.studyloop.backend.repository.ProfileRepository;
import app.studyloop.backend.security.UserPrincipal;
import app.studyloop.backend.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import app.studyloop.backend.domain.CollegeExamCalendar;
import app.studyloop.backend.repository.CollegeExamCalendarRepository;
import java.time.LocalDate;
import java.util.Collections;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;
    private final ProfileRepository profileRepository;
    private final CollegeExamCalendarRepository examCalendarRepository;

    public FeedController(FeedService feedService, 
                          ProfileRepository profileRepository,
                          CollegeExamCalendarRepository examCalendarRepository) {
        this.feedService = feedService;
        this.profileRepository = profileRepository;
        this.examCalendarRepository = examCalendarRepository;
    }

    @GetMapping
    public ResponseEntity<List<FeedItemDto>> getHomeFeed(@AuthenticationPrincipal UserPrincipal principal) {
        Profile viewer = profileRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("Viewer profile not found"));

        List<FeedItemDto> feed = feedService.getHomeFeed(viewer);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/exam-radar")
    public ResponseEntity<List<CollegeExamCalendar>> getExamRadar(@AuthenticationPrincipal UserPrincipal principal) {
        Profile viewer = profileRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("Viewer profile not found"));

        if (viewer.getCollege() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<CollegeExamCalendar> upcomingExams = examCalendarRepository
                .findByCollegeAndExamDateGreaterThanEqual(viewer.getCollege(), LocalDate.now());
        return ResponseEntity.ok(upcomingExams);
    }
}
