class Message < ActiveRecord::Base
  belongs_to :chat
  belongs_to :player
  
  def self.get_messages(session_id, player_id, last_message_id)
    messages = find(:all, :conditions => ["session_id = ? and id > ?", session_id, last_message_id], :order => "id DESC")
    formatted_content=""
    action="no_action"
    
    thisPlayer = Player.find(:first, :conditions => ["id = ?", player_id])
    player_number = thisPlayer.player_number
    
    messages.each do |message|
      formatted_content +=  "<message>"
      
      if message.id > last_message_id
        last_message_id = message.id
      end
      player = Player.find(:first, :conditions => ["id = ?", message.player_id])
      
      if player.player_number != player_number && message.message_type == "question"
        action="wait_for_your_response_and_chat"
      elsif player.player_number != player_number && message.message_type == "response"
        action="wait_for_other_player_question_and_chat"
      elsif player.player_number != player_number && message.message_type == "correct_choice"
        action="other_player_correct_choice"
      elsif player.player_number != player_number && message.message_type == "incorrect_choice"
        action="other_player_incorrect_choice"
      elsif player.player_number == player_number && message.message_type == "question"
        action="wait_for_other_player_response_and_chat"
      elsif player.player_number == player_number && message.message_type == "response"
        action="wait_for_your_question_and_chat"
      elsif player.player_number != player_number && message.content == "Sorry I can't play again now"
        action="other_player_cant_play_again"
      elsif player.player_number != player_number && message.content == "I would like to play again"
         action="other_player_can_play_again"
      end
      
      if player.player_number == 1
        formatted_content +=  "<color>red</color>"
      elsif player.player_number == 2
        formatted_content +=  "<color>blue</color>"
      end
      formatted_content +=  "<name>" + player.name + "</name>"
      if message.message_type == "chat"
        formatted_content +=  "<img_src>images/chat_small.png</img_src>"
      elsif message.message_type == "question"
          formatted_content +=  "<img_src>images/question_mark_button_small.png</img_src>"
      elsif message.message_type == "response"
          formatted_content +=  "<img_src>images/response.png</img_src>"
      elsif message.message_type == "correct_choice"
          formatted_content +=  "<img_src>images/response.png</img_src>"
      elsif message.message_type == "incorrect_choice"
          formatted_content +=  "<img_src>images/response.png</img_src>"
      end
# "<div class=\"cssbox-red\">\n<div class=\"cssbox_head-red\"><h2>" + player.name + "</h2></div>\n<div class=\"cssbox_body-red\">" + message.content + "</div>\n</div>"      
      if message.message_type == "question"
        message.content.chop!
	message.content = "Does your Alien have " + message.content + "?"
      end
      formatted_content +=  "<content>" + message.content + "</content></message>"
    end
    return [formatted_content, action, last_message_id]
  end
  
  def self.get_last_choice(session_id)
    message = find(:first, :conditions => ["session_id = ? and message_type LIKE ?", session_id, "%choice"], :order=>"id DESC")
    return message.content
  end
end
