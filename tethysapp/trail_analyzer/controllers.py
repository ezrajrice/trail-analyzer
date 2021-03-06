from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import LinePlot


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    # Create Highcharts plot here
    elevation_plot = LinePlot(
        height='500px',
        width='500px',
        engine='highcharts',
        title='Trail Plot',
        subtitle='',
        spline=True,
        x_axis_title='Distance',
        x_axis_units='ft',
        y_axis_title='Elevation',
        y_axis_units='ft',
        series=[
            {
                'name': 'Trail',
                'color': '#0066ff',
                'marker': {'enabled': False},
                'data': [
                    [0, 5], [10, -70],
                    [20, -86.5], [30, -66.5],
                    [40, -32.1],
                    [50, -12.5], [60, -47.7],
                    [70, -85.7], [80, -106.5]
                ]
            }
        ]
    )

    context = {'elevation_plot': elevation_plot}

    return render(request, 'trail_analyzer/home.html', context)