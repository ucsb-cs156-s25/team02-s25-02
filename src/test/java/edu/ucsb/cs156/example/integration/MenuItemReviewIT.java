package edu.ucsb.cs156.example.integration;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Import(TestConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD) // Resets database before each test
public class MenuItemReviewIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MenuItemReviewRepository menuItemReviewRepository;

    @Autowired
    private UserRepository userRepository; // Assuming you might need it for user setup or verification

    // Test for creating a new MenuItemReview
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void create_menu_item_review() throws Exception {
        // arrange
        String itemId = "1";
        String reviewerEmail = "test@example.com";
        int stars = 5;
        String dateReviewed = "2024-03-15T12:00:00";
        String comments = "Great food!";

        // act
        MvcResult response = mockMvc.perform(
                post("/api/menuitemreview/post")
                        .param("itemId", itemId)
                        .param("reviewerEmail", reviewerEmail)
                        .param("stars", String.valueOf(stars))
                        .param("dateReviewed", dateReviewed)
                        .param("comments", comments)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        String responseString = response.getResponse().getContentAsString();
        assertNotNull(responseString);
        assertTrue(responseString.contains(itemId));
        assertTrue(responseString.contains(reviewerEmail));
        assertTrue(responseString.contains(String.valueOf(stars)));
        assertTrue(responseString.contains(dateReviewed));
        assertTrue(responseString.contains(comments));

        // Verify the review was saved in the database
        MenuItemReview savedReview = objectMapper.readValue(responseString, MenuItemReview.class);
        assertNotNull(savedReview.getId());
        assertEquals(Long.parseLong(itemId), savedReview.getItemId());
        assertEquals(reviewerEmail, savedReview.getReviewerEmail());
        assertEquals(stars, savedReview.getStars());
        assertEquals(comments, savedReview.getComments());
    }

    // Add more tests here for other CRUD operations (e.g., GET one, GET all, PUT,
    // DELETE)
    // Remember to follow the article's guideline of testing at least one method
    // that changes the database.
    // Example: Test for GET all reviews (doesn't change DB but good for setup
    // verification)
    @WithMockUser(roles = { "USER" })
    @Test
    public void get_all_menu_item_reviews() throws Exception {
        // Setup: Create a review first
        MenuItemReview review1 = MenuItemReview.builder()
                .itemId(10L)
                .reviewerEmail("reviewer1@example.com")
                .stars(4)
                .dateReviewed(LocalDateTime.now().minusDays(1))
                .comments("Good stuff")
                .build();
        menuItemReviewRepository.save(review1);

        MenuItemReview review2 = MenuItemReview.builder()
                .itemId(20L)
                .reviewerEmail("reviewer2@example.com")
                .stars(5)
                .dateReviewed(LocalDateTime.now())
                .comments("Amazing!")
                .build();
        menuItemReviewRepository.save(review2);

        mockMvc.perform(get("/api/menuitemreview/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2)) // Check if two reviews are returned
                .andExpect(jsonPath("$[0].itemId").value(10L))
                .andExpect(jsonPath("$[1].itemId").value(20L));
    }
}
