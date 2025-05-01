package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import jakarta.validation.Valid;

import java.time.LocalDateTime;


@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

 
    @Operation(summary= "List all ucsb dining commons menu items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allItem() {
        Iterable<UCSBDiningCommonsMenuItem> menuitem = ucsbDiningCommonsMenuItemRepository.findAll();
        return menuitem;
    }


    /**
     * Create a new UCSBDiningCommonsMenuItem
     * 
     * @param diningCommonsCode  the code for the dining commons
     * @param name               the name of the menu item
     * @param station            the station where the item is served
     * @return the saved item
     */
    @Operation(summary = "Create a new UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postItem(
            @Parameter(name = "diningCommonsCode") @RequestParam String diningCommonsCode,
            @Parameter(name = "name") @RequestParam String name,
            @Parameter(name = "station") @RequestParam String station) {

        UCSBDiningCommonsMenuItem item = UCSBDiningCommonsMenuItem.builder()
                .diningCommonsCode(diningCommonsCode)
                .name(name)
                .station(station)
                .build();

        return ucsbDiningCommonsMenuItemRepository.save(item);
    }

    @Operation(summary= "Get a single menu item by id")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getById(@RequestParam Long id) {
        return ucsbDiningCommonsMenuItemRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));
}
    @Operation(summary= "Update a single UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
        public UCSBDiningCommonsMenuItem updateUCSBDiningCommonsMenuItem(
        @Parameter(name="id") @RequestParam Long id,
        @RequestBody @Valid UCSBDiningCommonsMenuItem incoming
        ) {
            UCSBDiningCommonsMenuItem item = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

            item.setDiningCommonsCode(incoming.getDiningCommonsCode());
            item.setName(incoming.getName());
            item.setStation(incoming.getStation());

            try {
                ucsbDiningCommonsMenuItemRepository.save(item);
            } catch (Exception e) {
                log.error("Error saving UCSBDiningCommonsMenuItem with id {}", id, e);
                throw new RuntimeException("Failed to update UCSBDiningCommonsMenuItem", e);
            }
            return item;
            
        }

    @Operation(summary = "Delete a UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonsMenuItem(
            @Parameter(name = "id") @RequestParam Long id) {
            UCSBDiningCommonsMenuItem item = ucsbDiningCommonsMenuItemRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));
        
            ucsbDiningCommonsMenuItemRepository.delete(item);
            return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
        }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(Map.of(
                                 "type", "RuntimeException",
                                 "message", ex.getMessage()
                             ));
    }
        
        



   
}


