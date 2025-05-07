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
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

    @Test
    public void adminUserCanCreateEditDeleteMenuItem() throws Exception {
        setupUser(true);

        // CREATE
        page.navigate("http://localhost:8080/diningcommonsmenuitem");
        page.click("a[href='/diningcommonsmenuitem/create']");
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("ortega");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("E2E Dish");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Entrees");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        // VERIFY CREATE
        page.waitForURL("**/diningcommonsmenuitem");
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
            .hasText("E2E Dish");

        // EDIT
        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();
        page.waitForURL("**/diningcommonsmenuitem/edit/1");
        // instead of header text, check the form field again
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Updated Station");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        // VERIFY EDIT
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
            .hasText("Updated Station");

        // DELETE
        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-id"))
            .not().isVisible();
    }

    @Test
    public void regularUserCannotSeeCreateLink() throws Exception {
        setupUser(false);
        page.navigate("http://localhost:8080/diningcommonsmenuitem");
        assertThat(page.getByText("Create")).not().isVisible();
    }
}
