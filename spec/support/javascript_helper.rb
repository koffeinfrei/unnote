module JavascriptHelper
  def js_timecop_freeze(date)
    execute_script %{
      window.fake_clock = sinon.useFakeTimers(
        new Date(#{date.year}, #{date.month - 1}, #{date.day}).getTime()
      );
    }

    yield

    execute_script %{
      window.fake_clock.restore();
    }
  end

  def js_timecop_tick(interval = 1.minute)
    execute_script %{
      window.fake_clock.tick(#{interval.to_i * 1000});
    }
  end
end

RSpec.configure do |config|
  config.include JavascriptHelper
end
