from tethys_sdk.base import TethysAppBase, url_map_maker


class TrailAnalyzer(TethysAppBase):
    """
    Tethys app class for Trail Analyzer.
    """

    name = 'Trail Analyzer'
    index = 'trail_analyzer:home'
    icon = 'trail_analyzer/images/icon.gif'
    package = 'trail_analyzer'
    root_url = 'trail-analyzer'
    color = '#3498db'
    description = 'Place a brief description of your app here.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='trail-analyzer',
                           controller='trail_analyzer.controllers.home'),
        )

        return url_maps