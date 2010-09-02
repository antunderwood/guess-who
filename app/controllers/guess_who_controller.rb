class GuessWhoController < ApplicationController
  before_filter :check_authentication, :except => [:signin, :player2_signin]
  layout "application", :except => :last_card

  @@name_hash = Hash.new
  @@name_hash["A1"] = "Snooz"
  @@name_hash["B1"] = "Zarg"
  @@name_hash["C1"] = "Sassle"
  @@name_hash["D1"] = "Gira"
  @@name_hash["E1"] = "Zog"
  @@name_hash["F1"] = "Yop"
  @@name_hash["A2"] = "Matag"
  @@name_hash["B2"] = "Pieb"
  @@name_hash["C2"] = "Uno"
  @@name_hash["D2"] = "Tonil"
  @@name_hash["E2"] = "Ufusi"
  @@name_hash["F2"] = "Veop"
  @@name_hash["A3"] = "Moog"
  @@name_hash["B3"] = "Jolod"
  @@name_hash["C3"] = "Pokov"
  @@name_hash["D3"] = "Zebo"
  @@name_hash["E3"] = "Hoobla"
  @@name_hash["F3"] = "Mush"
  @@name_hash["A4"] = "Gotat"
  @@name_hash["B4"] = "Zaphod"
  @@name_hash["C4"] = "Norboo"
  @@name_hash["D4"] = "Foobar"
  @@name_hash["E4"] = "Linrot"
  @@name_hash["F4"] = "Tag"

  @@columns = ["A1","B1","C1","D1","E1","F1","A2","B2","C2","D2","E2","F2","A3","B3","C3","D3","E3","F3","A4","B4","C4","D4","E4","F4"]

  def check_authentication 
    unless session[:user] 
      session[:intended_action] = action_name 
      session[:intended_controller] = controller_name 
      redirect_to :action => "signin" 
    end 
  end

  def index
    # @columns =[["A","B","C","D","E","F"],["A","B","C","D","E","F"],["A","B","C","D","E","F"],["A","B","C","D","E","F"]]
    @columns = @@columns
    @name_hash = @@name_hash
    @player = Player.find(:first, :conditions => ["game_id = ? and id = ?", session[:game_id], session[:player_id]])
    @card_choice = @columns[@player.chosen_card]
    game = Game.find(session[:game_id])
    @otherPlayer = game.other_player(@player)
    @gameState = "waiting_for_other_player_login" unless @otherPlayer.logged_in == 1
    @subtract_flag = 0
    @buttons = ["a", "head","mouth","eye","eyes","nose","eyes on stalks","skin","one","two","three","blue","green","orange","spotty","squiggly","circular","oval","triangular","happy","sad"]
    @display_link_for_player2 = true if params[:display_link_for_player2]
  end
  def cardstate
    render :text=>params[:cardState]
  end
  def last_card
    @name_hash = @@name_hash
  end

  def submit_last_card
    player = Player.find(:first, :conditions => ["game_id = ? and id = ?", session[:game_id], session[:player_id]])
    playerName = player.name
    otherPlayer = Player.find(:first, :conditions => ["game_id = ? and id != ?", session[:game_id], session[:player_id]])
    if @@columns[otherPlayer.chosen_card] == params[:last_card]
      xml="<input id=\"XML\" name=\"XML\" type=\"hidden\" value='<?xml version=\"1.0\"?><response><action>correct_choice</action>\n</response>' />"
      submit_message("correct_choice", playerName + " chose alien " + @@name_hash[params[:last_card]])
    else
      xml="<input id=\"XML\" name=\"XML\" type=\"hidden\" value='<?xml version=\"1.0\"?><response><action>incorrect_choice</action>\n</response>' />"
      submit_message("incorrect_choice", playerName + " chose alien " + @@name_hash[params[:last_card]])
    end
    render :text=>xml
  end

  def display_winner
    otherplayer = Player.find(:first, :conditions => ["game_id = ? and id != ?", session[:game_id], session[:player_id]])
    @otherPlayerName = otherplayer.name

    content = Message.get_last_choice(session[:game_id])
    content.gsub!(/.+alien\s/, "")
    @alien = content
    @@name_hash.each_key do |key|
      if @@name_hash[key] == @alien
        @card = key
        break
      end
    end
    render :layout => false	
  end

  def signin 
    if request.post?	
      id = User.authenticate(params[:username], params[:password])
      if id>0
        session[:user] = id

        game = Game.new
        game.password = newpass(8)
        game.whose_turn = params[:first_turn]
        game.save
        session[:game_id] = game.id
        session[:game_password] = game.password 

        player = Player.new
        player.game_id = game.id
        player.player_number=1
        player.name=params[:name]
        player.logged_in=1
        player.chosen_card=1 + rand(24)
        player.save
        session[:player_id] = player.id

        session[:other_player_name] = params[:player2_name]

        session[:last_message_id]=0
        if session[:intended_action] == nil
          session[:intended_action] = "index"
        end
        if session[:intended_controller] == nil
          session[:intended_controller] = "guess_who"
        end
        redirect_to :action => session[:intended_action], :controller => session[:intended_controller], :display_link_for_player2 => 1
        return
      end
      flash[:notice] = "Username or password invalid"
      redirect_to :action => "signin"
    end	 
  end

  def signout 
    session[:user] = nil 
    redirect_to :action=>"index"
  end

  def player2_signin 
    if request.get?	
      game = Game.authenticate(params[:game_id], params[:game_password])
      unless game.nil?
        session[:game_id] = game.id

        player = Player.new
        player.game_id = game.id
        player.player_number=2
        player.name=params[:player2_name]
        player.logged_in=1
        player.save

        session[:player_id] = player.id
        session[:user] = player.id # need to add this fake user to make sure logged in
        session[:first_turn] = game.whose_turn
        session[:last_message_id]=0

        otherPlayer = game.other_player(player)
        session[:other_player_name] = otherPlayer.name

        otherPlayerChosenCard = otherPlayer.chosen_card
        chosenCard = 1 + rand(24)
        while chosenCard == otherPlayerChosenCard
          chosenCard = 1 + rand(24)
        end
        player.chosen_card = chosenCard
        player.save

        redirect_to :action => 'index', :controller => 'guess_who'
        return
      end
      flash[:notice] = "Incorrect session information"
    end	 
  end


  def newpass( len=8 )
    chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
    newpass = ""
    1.upto(len) { |i| newpass << chars[rand(chars.size-1)] }
    return newpass
  end

  def submit_question
    thisPlayer = Player.find(session[:player_id])
    content = params[:question]
    submit_message("question", content)
    formatted_content, action, last_message_id = retrieve_messages(thisPlayer)
    return_xml(action, formatted_content)
    return
  end
  def submit_chat
    thisPlayer = Player.find(session[:player_id])
    content = params[:message]
    submit_message("chat", content)
    formatted_content, action, last_message_id = retrieve_messages(thisPlayer)
    return_xml(action, formatted_content)
    return
  end
  def submit_yes_response
    thisPlayer = Player.find(session[:player_id])
    submit_message("response", "Yes")
    formatted_content, action, last_message_id = retrieve_messages(thisPlayer)
    return_xml(action, formatted_content)
    return
  end
  def submit_no_response
    thisPlayer = Player.find(session[:player_id])
    submit_message("response", "No")
    formatted_content, action, last_message_id = retrieve_messages(thisPlayer)
    return_xml(action, formatted_content)
    return
  end

  def submit_message(message_type, content)
    message = Message.new
    message.game_id = session[:game_id]
    message.player_id = session[:player_id]
    message.content = content
    message.message_type = message_type
    message.save
  end
  def play_again
    submit_message("chat", "I would like to play again")
    formatted_content, action, last_message_id = retrieve_messages()
    if action == "other_player_can_play_again"
      action = "play_again"
    end
    return_xml(action, formatted_content)
    return
  end
  def dont_play_again
    submit_message("chat", "Sorry I can not play again now")
    formatted_content, action, last_message_id = retrieve_messages()
    return_xml("cant_play_again", formatted_content, session[:last_message_id])
    return
  end
  def retrieve_messages(player)
    formatted_content, action, last_message_id = Message.get_messages(session[:game_id], player,player.last_message_displayed)
    player.update_attribute(:last_message_displayed , last_message_id)
    return [formatted_content, action, last_message_id]
  end

  def return_xml(action, content)
    xml="<input id=\"XML\" name=\"XML\" type=\"hidden\" value='<?xml version=\"1.0\"?><response><action>" + action + "</action>\n" +  content + "</response>' />"
    render :text=>xml
  end

  def periodic_update
    thisPlayer = Player.find(session[:player_id])
    thisPlayer.update_attribute(:logged_in, 1)
    game = Game.find(session[:game_id])
    otherPlayer = game.other_player(thisPlayer)

    action=""
    formatted_content=""
    last_message_id = thisPlayer.last_message_displayed
    if !otherPlayer
      action="waiting_for_other_player_login"
    elsif  params[:gameState] == "waiting_for_other_player_login" && otherPlayer.logged_in == 1

      if game.whose_turn == otherPlayer.player_number
        action = "wait_for_other_player_question_and_chat"
      else
        action = "wait_for_your_question_and_chat"
      end
    else
      formatted_content, action ,last_message_id = retrieve_messages(thisPlayer)
    end
    return_xml(action, formatted_content)
    return
  end

  def reset_game
    players = Player.find(:all, :conditions => ["game_id = ?", session[:game_id]])
    chosenCard = 1 + rand(24)
    players.first.chosen_card = chosenCard
    players.first.save

    chosenCard2 = 1 + rand(24)
    while chosenCard2 == chosenCard
      chosenCard2 = 1 + rand(24)
    end
    players.last.chosen_card = chosenCard2
    players.last.save

    thisSession = Session.find(session[:game_id])
    if thisSession.whose_turn == 1
      thisSession.whose_turn = 2
    else
      thisSession.whose_turn = 1
    end
    thisSession.save
    render :text=>"reset"
    return
  end
end
