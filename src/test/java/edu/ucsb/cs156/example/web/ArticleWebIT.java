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
public class ArticleWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByLabel("Title").fill("ucsb");
        page.getByLabel("Url").fill("https://www.ucsb.edu");
        page.getByLabel("Explanation").fill("University of California, Santa Barbara");
        page.getByLabel("Email").fill("1@ucsb.edu");
        page.getByLabel("Date Added").fill("2022-01-03T00:00");
        // page.getByText("Create").click();
        page.locator("button:has-text(\"Create\")").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title"))
                .hasText("ucsb");

        page.getByTestId("ArticleTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByLabel("Title").fill("UCSBBB");
        page.locator("button:has-text(\"Update\")").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).hasText("UCSBBB");

        page.getByTestId("ArticleTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-name")).not().isVisible();
    }
}