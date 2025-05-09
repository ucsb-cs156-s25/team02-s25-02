package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menu_item_review() throws Exception {
        setupUser(true);

        page.getByText("MenuItemReview").click();

        page.getByText("Create Menu Item Review").click();
        assertThat(page.getByText("Create New Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-itemId").fill("1");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("test@test.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("5");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2021-01-01T12:00");
        page.getByTestId("MenuItemReviewForm-comments").fill("This is a test review");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail"))
                .hasText("test@test.com");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("test2@test.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("4");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2021-01-01T12:00");
        page.getByTestId("MenuItemReviewForm-comments").fill("This is a test review 2");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("This is a test review 2");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menu_item_review() throws Exception {
        setupUser(false);

        page.getByText("MenuItemReview").click();

        assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).not().isVisible();
    }
}