/* jshint -W033 */
/* jshint -W067 */

/*
 * TODO: Improve code
 * TODO: Define color status games (won green - loose red)
 * TODO: Let player choose between x & o
 * TODO: Let player choose between player 1 or player 2
 * TODO: Improve AI. Made response based on winningCombinations randomly or not
 * TODO: Add AI level
 *   - low level = high random (based on available square)
 *     + get available winning combination
 *   - high level = low random (based on winningCombinations)
 *     + prevent user to won from winningCombinations
 */
(function(window) {
  'use strict'

  window.TicTacToe = {
    init: function() {
      this.text = {
        score: this.elements.score.innerHTML,
      }

      this.setPlayerTurn('user')
      this.handleClick()
      this.handleResetGame()
      this.setScore()
    },

    elements: {
      resetButton: document.getElementsByClassName('reset')[0],
      titleGameState: document.getElementsByClassName('game-state')[0],
      squares: document.getElementsByClassName('tic-tac-toe__square'),
      score: document.getElementsByClassName('score')[0],
    },

    player: {
      x: {
        name: 'User',
        score: 0,
        turn: false,
      },
      o: {
        name: 'Computer',
        score: 0,
        turn: false,
      },
    },

    config: {
      colors: {
        winner: '',
        looser: '',
      },
    },

    gameState: 'pending',

    // Based on this structure:
    //   a  b  c
    // 1 __|__|__
    // 2 __|__|__
    // 3 __|__|__
    winningCombinations: [
      // Horizontal
      ['a-1', 'a-2', 'a-3'],
      ['b-1', 'b-2', 'b-3'],
      ['c-1', 'c-2', 'c-3'],
      // Vertical
      ['a-1', 'b-1', 'c-1'],
      ['a-2', 'b-2', 'c-2'],
      ['a-3', 'b-3', 'c-3'],
      // Diagonal
      ['a-1', 'b-2', 'c-3'],
      ['a-3', 'b-2', 'c-1'],
    ],

    handleResetGame: function() {
      var self = this

      this.elements.resetButton.addEventListener('click', function() {
        self.elements.titleGameState.innerHTML = ''
        self.setGameState('pending')

        for (var i = 0; i < self.elements.squares.length; i++) {
          var square = self.elements.squares[i]
          square.innerHTML = ''
          square.setAttribute('data-value', '')
          square.removeAttribute('style')
        }
      })
    },

    showWinner: function(player) {
      this.elements.titleGameState.innerHTML = player.name === 'Computer' ?
        'You loose :( !' :
        'You won :) !'
    },

    setScore: function() {
      var html = this.text.score
      var varMatches = html.match(/{[a-zA-Z\.]+}/g)

      for (var i = 0; i < varMatches.length; i++) {
        var varMatch = varMatches[i].replace(/{/, '').replace(/}/, '')
        var text = window.Utility.Object.byString(this, varMatch)

        html = html.replace(varMatches[i], text)
      }

      this.elements.score.innerHTML = html
    },

    setPlayerTurn: function(type) {
      if (type === 'x') {
        this.player.x.turn = true
        this.player.o.turn = false

        return
      }

      this.player.x.turn = false
      this.player.o.turn = true
    },

    setWinner: function(type) {
      this.player[type].score += 1
      this.setGameState('ended')
      this.showWinner(this.player[type])
      this.setScore()
    },

    setGameState: function(state) {
      switch (state) {
        case 'pending':
          this.gameState = state
          this.elements.resetButton.innerHTML = 'reset'
          this.setPlayerTurn('user');
          // Add all event listener
          break;
        case 'started':
          this.gameState = state
          this.elements.resetButton.innerHTML = 'reset'
          break;
        case 'ended':
          this.gameState = state
          this.elements.resetButton.innerHTML = 'retry'
          // Remove all event listener
          break;
      }
    },

    tag: function(type) {
      return '<div class="' + type + '-tag"></div>'
    },

    playTag: function(element, type) {
      if (this.gameState === 'ended') return
      if (this.gameState === 'pending') this.setGameState('started')

      element.innerHTML = this.tag(type)
      element.setAttribute('data-value', type)
      this.setPlayerTurn(type);
      this.checkWinningCombination(type)
    },

    addClickListener: function() {
      var self = TicTacToe

      if (this.getAttribute('data-value')) return
      if (self.gameState === 'ended') return

      self.playTag(this, 'x')
      self.computerPlay()
    },

    handleClick: function() {
      for (var i = 0; i < this.elements.squares.length; i++) {
        var square = this.elements.squares[i]

        square.addEventListener('click', this.addClickListener.bind(square))
      }
    },

    computerPlay: function() {
      var availableSquares = []

      for (var i = 0; i < this.elements.squares.length; i++) {
        var square = this.elements.squares[i]

        if (!square.getAttribute('data-value')) {
          availableSquares.push(square)
        }
      }

      // No one won
      if (availableSquares.length === 0) return

      this.playTag(this.randomSquare(availableSquares), 'o')
    },

    randomSquare: function(squares) {
      return squares[Math.floor(Math.random() * squares.length)]
    },

    checkWinningCombination: function(type) {
      var self = this
      var playedSquare = []
      var player = this.player[type].name

      for (var i = 0; i < this.elements.squares.length; i++) {
        var square = this.elements.squares[i]

        if (square.getAttribute('data-value') === type) {
          playedSquare.push(square.getAttribute('data-square'))
        }
      }

      if (playedSquare.length >= 3) {
        for (var j = 0; j < this.winningCombinations.length; j++) {
          var winningCombination = this.winningCombinations[j]

          var won = window.Utility.matchFirstArray(
            winningCombination, playedSquare
          )

          if (won) {
            var matchesNodeList = document.querySelectorAll(
              "[data-square='" +
              winningCombination.join("'], [data-square='") +
              "']"
            )

            window.Utility.foreach(
              matchesNodeList,
              this.setBackgroundOnWinningCombination.bind(self)
            )

            this.setWinner(type)
          }
        }
      }
    },

    setBackgroundOnWinningCombination: function(index, square) {
      square.style.background = this.player.x.turn ? 'lightgreen' : 'red'
    }
  }

  window.TicTacToe.init()
})(window)
