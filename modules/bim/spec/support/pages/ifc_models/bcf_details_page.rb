#-- copyright
# OpenProject is an open source project management software.
# Copyright (C) 2012-2020 the OpenProject GmbH
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2017 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See docs/COPYRIGHT.rdoc for more details.
#++

require 'support/pages/work_packages/split_work_package'

module Pages
  class BcfDetailsPage < Pages::SplitWorkPackage
    def expect_viewpoint_count(number)
      expect(page).to have_selector('.ngx-gallery-thumbnail', count: number, wait: 20)
    end

    def next_viewpoint
      page.find('.icon-arrow-right2.ngx-gallery-icon-content').click
    end

    def previous_viewpoint
      page.find('.icon-arrow-left2.ngx-gallery-icon-content').click
    end

    def show_current_viewpoint
      page.find('.icon-watched.ngx-gallery-icon-content').click
    end

    def delete_current_viewpoint(confirm: true)
      page.find('.icon-delete.ngx-gallery-icon-content').click

      if confirm
        page.driver.browser.switch_to.alert.accept
      else
        page.driver.browser.switch_to.alert.dismiss
      end
    end

    def add_viewpoint
      page.find('a.button', text: 'Viewpoint').click
    end

    protected

    def path(tab = 'overview')
      bcf_project_frontend_path project, "split/details/#{work_package.id}/#{tab}"
    end
  end
end
