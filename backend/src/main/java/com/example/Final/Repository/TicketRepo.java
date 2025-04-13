package com.example.Final.Repository;


import com.example.Final.Model.ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepo extends JpaRepository<ticket, Long> {
    long countByCategory(String category);

    List<ticket> findByCategory(String category);

    List<ticket> findByStatus(String status);

    long countByStatus(String status);
}

