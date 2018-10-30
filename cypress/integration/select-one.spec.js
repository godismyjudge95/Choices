describe('Choices - select one', () => {
  beforeEach(() => {
    cy.visit('/select-one.html');
  });

  describe('scenarios', () => {
    describe('basic', () => {
      beforeEach(() => {
        // open dropdown
        cy.get('[data-test-hook=basic]')
          .find('.choices')
          .click();
      });

      describe('focusing on text input', () => {
        it('displays a dropdown of choices', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown')
            .should('be.visible');

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .should('have.length', 4)
            .each(($choice, index) => {
              expect($choice.text().trim()).to.equal(`Choice ${index + 1}`);
            });
        });

        describe('pressing escape', () => {
          beforeEach(() => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type('{esc}');
          });

          it('closes the dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('not.be.visible');
          });
        });
      });

      describe('selecting choices', () => {
        const selectedChoiceText = 'Choice 1';

        it('allows me select choices from a dropdown', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .click();

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--single .choices__item')
            .last()
            .should($item => {
              expect($item).to.contain(selectedChoiceText);
            });
        });

        it('does not remove selected choice from dropdown list', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .click();

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .should($item => {
              expect($item).to.contain(selectedChoiceText);
            });
        });
      });

      describe('searching choices', () => {
        describe('on input', () => {
          describe('searching by label', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('item 2');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Choice 2');
                });
            });
          });

          describe('searching by value', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('find me');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Choice 3');
                });
            });
          });

          describe('no results found', () => {
            it('displays "no results found" prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('faergge');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No results found');
                });
            });
          });
        });
      });
    });

    describe('remove button', () => {
      /*
        {
          removeItemButton: true,
        }
      */
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=remove-button]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();
      });

      describe('remove button', () => {
        describe('on click', () => {
          let removedChoiceText;

          beforeEach(() => {
            cy.get('[data-test-hook=remove-button]')
              .find('.choices__list--single .choices__item')
              .last()
              .then($choice => {
                removedChoiceText = $choice.text().trim();
              })
              .click();

            cy.get('[data-test-hook=remove-button]')
              .find('.choices__list--single .choices__item')
              .last()
              .find('.choices__button')
              .focus()
              .click();
          });

          it('removes selected choice', () => {
            cy.get('[data-test-hook=remove-button]')
              .find('.choices__list--single')
              .children()
              .should('have.length', 0);
          });

          it('updates the value of the original input', () => {
            cy.get('[data-test-hook=remove-button]')
              .find('.choices__input.is-hidden')
              .should($select => {
                const val = $select.val() || [];

                expect(val).to.not.contain(removedChoiceText);
              });
          });
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        let selectedChoiceText;

        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]').click();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .then($choice => {
              selectedChoiceText = $choice.text().trim();
            })
            .click();
        });

        it('does not change selected choice', () => {
          cy.get('[data-test-hook=prepend-append]')
            .find('.choices__list--single .choices__item')
            .last()
            .should($choice => {
              expect($choice.text()).to.not.contain(selectedChoiceText);
            });
        });

        it('closes the dropdown list', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('adding items disabled', () => {
      /*
        {
          addItems: false,
        }
      */
      beforeEach(() => {
        cy.get('[data-test-hook=add-items-disabled]')
          .find('.choices')
          .click();
      });

      it('disables the search input', () => {
        cy.get('[data-test-hook=add-items-disabled]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });

      describe('on click', () => {
        it('does not open choice dropdown', () => {
          cy.wait(500); // allow for animation frame
          cy.get('[data-test-hook=add-items-disabled]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('disabled via attribute', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=disabled-via-attr]')
          .find('.choices')
          .click();
      });

      it('disables the search input', () => {
        cy.get('[data-test-hook=disabled-via-attr]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });

      describe('on click', () => {
        it('does not open choice dropdown', () => {
          cy.wait(500); // allow for animation frame
          cy.get('[data-test-hook=disabled-via-attr]')
            .find('.choices__list--dropdown')
            .should('not.be.visible');
        });
      });
    });

    describe('prepend/append', () => {
      /*
        {
          prependValue: 'before-',
          appendValue: '-after',
        };
      */

      let selectedChoiceText;

      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .then($choice => {
            selectedChoiceText = $choice.text().trim();
          })
          .click();
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(
              `before-${selectedChoiceText}-after`,
            );
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($choice => {
            expect($choice.text()).to.not.contain(
              `before-${selectedChoiceText}-after`,
            );
            expect($choice.text()).to.contain(selectedChoiceText);
          });
      });
    });

    describe('render choice limit', () => {
      /*
        {
          renderChoiceLimit: 1
        }
      */

      it('only displays given number of choices in the dropdown', () => {
        cy.get('[data-test-hook=render-choice-limit]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .should('have.length', 1);
      });
    });

    describe('search disabled', () => {
      /*
        {
          searchEnabled: false
        }
      */
      const selectedChoiceText = 'Choice 3';

      beforeEach(() => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices')
          .click();
      });

      it('does not display a search input', () => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__input--cloned')
          .should('not.exist');
      });

      it('allows me select choices from a dropdown', () => {
        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();

        cy.get('[data-test-hook=search-disabled]')
          .find('.choices__list--single .choices__item')
          .last()
          .should($item => {
            expect($item).to.contain(selectedChoiceText);
          });
      });
    });

    describe('search floor', () => {
      /*
        {
          searchFloor: 10,
        };
      */

      describe('on input', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=search-floor]')
            .find('.choices__input--cloned')
            .focus();
        });

        describe('search floor not reached', () => {
          it('displays choices not filtered by inputted value', () => {
            const searchTerm = 'item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.not.contain(searchTerm);
              });
          });
        });

        describe('search floor reached', () => {
          it('displays choices filtered by inputted value', () => {
            const searchTerm = 'Choice 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.contain(searchTerm);
              });
          });
        });
      });
    });

    describe('remote data', () => {
      beforeEach(() => {
        cy.reload(true);
      });

      describe('when loading data', () => {
        it('shows a loading message as a placeholder', () => {
          cy.get('[data-test-hook=remote-data]')
            .find('.choices__list--single')
            .children()
            .first()
            .should('have.class', 'choices__placeholder')
            .and($placeholder => {
              expect($placeholder).to.contain('Loading...');
            });
        });

        describe('opening the dropdown', () => {
          it('displays "no choices to choose" prompt', () => {
            cy.get('[data-test-hook=remote-data]').click();
            cy.get('[data-test-hook=remote-data]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should($dropdown => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal('No choices to choose from');
              });
          });
        });
      });

      describe('when data has loaded', () => {
        describe('opening the dropdown', () => {
          it('displays the loaded data', () => {
            cy.wait(2000);
            cy.get('[data-test-hook=remote-data]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 50)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(`Label ${index + 1}`);
                expect($choice.data('value')).to.equal(`Value ${index + 1}`);
              });
          });
        });
      });
    });

    describe('scrolling dropdown', () => {
      let choicesCount;

      beforeEach(() => {
        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices__list--dropdown .choices__list .choices__item')
          .then($choices => {
            choicesCount = $choices.length;
          });

        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices')
          .click();
      });

      it('highlights first choice on dropdown open', () => {
        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices__list--dropdown .choices__list .is-highlighted')
          .should($choice => {
            expect($choice.text().trim()).to.equal('Choice 1');
          });
      });

      it('scrolls to next choice on down arrow', () => {
        for (let index = 0; index < choicesCount; index++) {
          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__list--dropdown .choices__list .is-highlighted')
            .should($choice => {
              expect($choice.text().trim()).to.equal(`Choice ${index + 1}`);
            });

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{downarrow}');
        }
      });

      it('scrolls up to previous choice on up arrow', () => {
        // scroll to last choice
        for (let index = 0; index < choicesCount; index++) {
          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{downarrow}');
        }

        // scroll up to first choice
        for (let index = choicesCount; index > 0; index--) {
          cy.wait(100); // allow for dropdown animation to finish

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__list--dropdown .choices__list .is-highlighted')
            .should($choice => {
              expect($choice.text().trim()).to.equal(`Choice ${index}`);
            });

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{uparrow}');
        }
      });
    });

    describe('choice groups', () => {
      const choicesInGroup = 3;
      let groupValue;

      beforeEach(() => {
        cy.get('[data-test-hook=groups]')
          .find('.choices__list--dropdown .choices__list .choices__group')
          .first()
          .then($group => {
            groupValue = $group.text().trim();
          });
      });

      describe('selecting all choices in group', () => {
        it('removes group from dropdown', () => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus();

            cy.get('[data-test-hook=groups]')
              .find('.choices__list--dropdown .choices__list .choices__item')
              .first()
              .click();
          }

          cy.get('[data-test-hook=groups]')
            .find('.choices__list--dropdown .choices__list .choices__group')
            .first()
            .should($group => {
              expect($group.text().trim()).to.not.equal(groupValue);
            });
        });
      });

      describe('deselecting all choices in group', () => {
        beforeEach(() => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus();

            cy.get('[data-test-hook=groups]')
              .find('.choices__list--dropdown .choices__list .choices__item')
              .first()
              .click();
          }
        });

        it('shows group in dropdown', () => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus()
              .type('{backspace}');
          }

          cy.get('[data-test-hook=groups]')
            .find('.choices__list--dropdown .choices__list .choices__group')
            .first()
            .should($group => {
              expect($group.text().trim()).to.equal(groupValue);
            });
        });
      });
    });

    describe('parent/child', () => {
      describe('selecting "Parent choice 2"', () => {
        it('enables the child Choices instance', () => {
          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(1)
            .should('have.class', 'is-disabled');

          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(0)
            .click();

          cy.get('[data-test-hook=parent-child]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .eq(1)
            .click();

          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(1)
            .should('not.have.class', 'is-disabled');
        });
      });

      describe('changing selection from "Parent choice 2" to something else', () => {
        it('disables the child Choices instance', () => {
          // open parent instance and select second choice
          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(0)
            .click()
            .find('.choices__list--dropdown .choices__list')
            .children()
            .eq(1)
            .click();

          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(1)
            .should('not.have.class', 'is-disabled');

          // open parent instance and select third choice
          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(0)
            .click()
            .find('.choices__list--dropdown .choices__list')
            .children()
            .eq(2)
            .click();

          cy.get('[data-test-hook=parent-child]')
            .find('.choices')
            .eq(1)
            .should('have.class', 'is-disabled');
        });
      });
    });
  });
});
