package com.gdssoft.oa.service.flow;

import java.util.Comparator;
import java.util.Date;

import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.DateUtil;

public class ASCTaskComparator implements Comparator{

	@Override
	public int compare(Object o1, Object o2) {
		// TODO Auto-generated method stub
		TaskInfo task1 = (TaskInfo)o1;
		TaskInfo task2 = (TaskInfo)o2;
		if (task1.getCreateTime().getTime() > task2.getCreateTime().getTime()) {
			return 1;
		} else {
			if (task1.getCreateTime().getTime() == task2.getCreateTime().getTime()) {
				return 0;
			} else {
				return -1;
			}
		}
	}
	public static void main(String[] args) {
		System.out.println(DateUtil.parseDate("2011-04-05 1:00:00").getTime() > DateUtil.parseDate("2011-04-05 2:00:00").getTime());
	}

}
