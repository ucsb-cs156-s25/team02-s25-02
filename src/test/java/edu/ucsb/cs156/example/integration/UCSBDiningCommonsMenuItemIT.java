package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemIT {

    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    UCSBDiningCommonsMenuItemRepository menuItemRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    /**
     * Test that a logged-in user with ROLE_USER can retrieve an existing menu item by id
     */
    @WithMockUser(roles = { "USER" })
    @Test
    public void test_user_can_get_menuItem_by_id_when_exists() throws Exception {
        // arrange: clear and insert one entity
        menuItemRepository.deleteAll();
        UCSBDiningCommonsMenuItem item = UCSBDiningCommonsMenuItem.builder()
            .diningCommonsCode("ortega")
            .name("Test Dish")
            .station("Entrees")
            .build();
        menuItemRepository.save(item);

        // act: call GET /api/ucsbdiningcommonsmenuitem?id=1
        MvcResult response = mockMvc.perform(get("/api/ucsbdiningcommonsmenuitem?id=1"))
            .andExpect(status().isOk())
            .andReturn();

        // assert: returned JSON matches saved entity
        String expectedJson = mapper.writeValueAsString(item);
        String actual = response.getResponse().getContentAsString();
        assertEquals(expectedJson, actual);
    }

    /**
     * Test that an admin user can create a new menu item via POST
     */
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void test_admin_can_post_new_menuItem() throws Exception {
        // arrange: ensure empty repository
        menuItemRepository.deleteAll();

        // expected entity (id will be 1)
        UCSBDiningCommonsMenuItem expectedItem = UCSBDiningCommonsMenuItem.builder()
            .id(1L)
            .diningCommonsCode("portola")
            .name("New Dish")
            .station("Grill")
            .build();

        // act: perform POST
        MvcResult response = mockMvc.perform(post("/api/ucsbdiningcommonsmenuitem/post")
                .param("diningCommonsCode", "portola")
                .param("name", "New Dish")
                .param("station", "Grill")
                .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

        // assert: JSON matches
        String expectedJson = mapper.writeValueAsString(expectedItem);
        String actual = response.getResponse().getContentAsString();
        assertEquals(expectedJson, actual);
    }
}
