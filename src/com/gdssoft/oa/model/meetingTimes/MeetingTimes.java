package com.gdssoft.oa.model.meetingTimes;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.core.model.BaseModel;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;

public class MeetingTimes extends BaseModel{
	protected Long timesId;//主键
	protected Long year;//年
	protected Long times;//期数
	protected Long type;//1:主任办公会
	
	public Long getTimesId() {
		return timesId;
	}
	public void setTimesId(Long timesId) {
		this.timesId = timesId;
	}
	public Long getYear() {
		return year;
	}
	public void setYear(Long year) {
		this.year = year;
	}
	public Long getTimes() {
		return times;
	}
	public void setTimes(Long times) {
		this.times = times;
	}
	public Long getType() {
		return type;
	}
	public void setType(Long type) {
		this.type = type;
	}
	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof MeetingTimes)) {
			return false;
		}
		MeetingTimes rhs = (MeetingTimes) object;
		return new EqualsBuilder().append(this.timesId, rhs.timesId)
				.append(this.year, rhs.year)
				.append(this.times, rhs.times)
				.append(this.type, rhs.type).isEquals();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("timesId", this.timesId)
				.append("year", this.year)
				.append("times", this.times)
				.append("type", this.type).toString();
	}

}
