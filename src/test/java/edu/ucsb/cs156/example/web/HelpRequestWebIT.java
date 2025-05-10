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
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_helpRequest() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        page.getByText("Create Help Request").click();
        assertThat(page.getByText("Create New Help Request")).isVisible();
        page.getByLabel("requesterEmail").fill("ayalawang@ucsb.edu");
        page.getByLabel("teamId").fill("02");
        page.getByLabel("Table or Breakout Room").fill("02");
        page.getByLabel("Request Time (iso format)").fill("2022-01-03T00:00");
        page.getByLabel("Explanation").fill("skill issue git good");
        page.getByLabel("Solved").fill("true");

        page.getByTestId("HelpRequestForm-submit").click();


        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("ayalawang@ucsb.edu");

        // page.getByTestId("RestaurantTable-cell-row-0-col-Edit-button").click();
        // assertThat(page.getByText("Edit Restaurant")).isVisible();
        // page.getByTestId("RestaurantForm-description").fill("THE BEST");
        // page.getByTestId("RestaurantForm-submit").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE BEST");

        // page.getByTestId("RestaurantTable-cell-row-0-col-Delete-button").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helprequest() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
    }
}