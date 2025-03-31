package com.Destek.Support.service;

import com.Destek.Support.model.Message;
import com.Destek.Support.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message save(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> findByRequestId(Long requestId) {
        return messageRepository.findByRequestId(requestId);
    }

    public List<Message> findBySenderId(Long senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }
} 