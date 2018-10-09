package com.gdssoft.oa.action.flow;

import com.google.common.collect.Interner;
import com.google.common.collect.Interners;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

/**
 * 当前流程处理帮助类
 *
 * @author: lgaoyi
 * @date: 2018/5/30 20:51
 */
public class CurrentTaskHelper {

    private static final Interner<String> pool = Interners.newWeakInterner();

    private final static Map<String, String> currentTaskMap = new HashMap<>();

    private final static Map<String, LinkedList<String>> currentProcessMap = new HashMap<>();

    public static void put(String taskId, String userId) {
        currentTaskMap.put(taskId, userId);
    }

    public static String get(String taskId) {
        return currentTaskMap.get(taskId);
    }

    public static void remove(String taskId) {
        currentTaskMap.remove(taskId);
    }

    /**
     * 当前流程执行+1
     *
     * @param hisactinstId
     */
    public static void addProcessNum(String hisactinstId, String userId) {
        synchronized (pool.intern("CURRENT_PROCESS_NUM")) {
            if (!currentProcessMap.containsKey(hisactinstId)) {
                currentProcessMap.put(hisactinstId, new LinkedList<String>());
            }
            currentProcessMap.get(hisactinstId).add(userId);
        }
    }

    /**
     * 当前流程执行-1
     *
     * @param hisactinstId
     */
    public static void reduceProcessNum(String hisactinstId, String userId) {
        synchronized (pool.intern("CURRENT_PROCESS_NUM")) {
            if (!currentProcessMap.containsKey(hisactinstId)) {
                return;
            }
            currentProcessMap.get(hisactinstId).remove(userId);
            if (currentProcessMap.get(hisactinstId).size() <= 0) {
                currentProcessMap.remove(hisactinstId);
            }
        }
    }

    /**
     * 当前流程执行数
     *
     * @param hisactinstId
     * @return
     */
    public static Integer getProcessNum(String hisactinstId, String userId) {
        if (currentProcessMap.get(hisactinstId) != null) {
            LinkedList<String> users = currentProcessMap.get(hisactinstId);
            int size = users.size();
            int count = 0;
            for (int i = 0; i < size; i++) {
                count++;
                if (StringUtils.equals(users.get(i), userId)) {
                    break;
                }
            }
            return count;
        }
        return 0;
    }

    public static void main(String[] args) {
        CurrentTaskHelper.addProcessNum("100", "200");
        CurrentTaskHelper.addProcessNum("100", "201");
        CurrentTaskHelper.addProcessNum("100", "202");
        CurrentTaskHelper.addProcessNum("100", "203");
        CurrentTaskHelper.addProcessNum("100", "204");
        CurrentTaskHelper.addProcessNum("100", "205");
        System.out.println("+205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));

        CurrentTaskHelper.reduceProcessNum("100", "200");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
        CurrentTaskHelper.addProcessNum("100", "206");
        CurrentTaskHelper.addProcessNum("100", "207");
        CurrentTaskHelper.addProcessNum("100", "208");
        CurrentTaskHelper.reduceProcessNum("100", "201");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
        CurrentTaskHelper.reduceProcessNum("100", "202");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
        CurrentTaskHelper.reduceProcessNum("100", "203");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
        CurrentTaskHelper.reduceProcessNum("100", "204");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
        CurrentTaskHelper.reduceProcessNum("100", "205");
        System.out.println("205前面还有：" + CurrentTaskHelper.getProcessNum("100", "205"));
    }
}
