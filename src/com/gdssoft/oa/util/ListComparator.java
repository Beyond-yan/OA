package com.gdssoft.oa.util;

import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.*;

public class ListComparator implements Comparator {

	public ListComparator() {
	}

	public ListComparator(String methodName) {
		this.methodName = methodName;
	}

	// 空:普通的数据类型 非空:对象数据类型 取methodName返回值比较
	String methodName;

	public Object getValue(Object bean, String methodName) throws Exception {
		Method getMethod = bean.getClass().getMethod(methodName, null);
		return getMethod.invoke(bean, null);
	}

	public int compare(Object obj1, Object obj2) {
		int val = -1;
		try {
			if (methodName == null) {
				val = _compare(obj1, obj2);
			} else {
				val = _compare(getValue(obj1, methodName),
						getValue(obj2, methodName));
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return val;
	}

	public int _compare(Object obj1, Object obj2) throws Exception {
		if (obj1 == null || obj2 == null)
			return obj1 == null ? -1 : 1;
		Class cl = obj1.getClass();
		if (obj1 instanceof java.lang.Comparable) {
			// byte int long float..number, date , boolean , char
			Method getMethod = obj1.getClass().getMethod("compareTo",
					new Class[] { cl });
			return (Integer) getMethod.invoke(obj1, new Object[] { obj2 });
		}
		return -1;
	}

	public List removeDuplicate(List list) {
		if(list!=null&&list.size()>0){
			for (int i = 0; i < list.size() - 1; i++) {
				for (int j = list.size() - 1; j > i; j--) {
					if (list.get(j).equals(list.get(i))) {
						list.remove(j);
					}
				}
			}
		}
		return list;
	}
}

// 测试类
class Test {
	Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public static void main(String[] args) {

		// 普通数据类型 升序
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		List list = new ArrayList();
		for (long i = 0; i < 5; i++) {
			list.add(new Date(System.currentTimeMillis()
					+ (int) (Math.random() * 1000000000)));
		}

		ListComparator c = new ListComparator();
		Collections.sort(list, c);

		for (int i = 0; i < list.size(); i++) {
			System.out.println(simpleDateFormat.format(list.get(i)));
		}

		// 对象数据类型 降序
		List<Test> userList = new ArrayList();
		Test test = new Test();
		test.setId(null);
		userList.add(test);

		for (long i = 0; i < 5; i++) {
			test = new Test();
			test.setId(i);
			userList.add(test);
		}

		c = new ListComparator("getId");
		Collections.sort(userList, Collections.reverseOrder(c));

		for (int i = 0; i < userList.size(); i++) {
			System.out.println(userList.get(i).getId());
		}

	}

}