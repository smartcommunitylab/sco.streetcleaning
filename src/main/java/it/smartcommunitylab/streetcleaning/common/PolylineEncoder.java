/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.streetcleaning.common;

import java.util.ArrayList;
import java.util.List;

import it.smartcommunitylab.streetcleaning.bean.PointBean;

public class PolylineEncoder {


	private static StringBuffer encodeSignedNumber(int num) {
        int sgn_num = num << 1;
        if (num < 0) {
            sgn_num = ~(sgn_num);
        }
        return(encodeNumber(sgn_num));
    }

    private static StringBuffer encodeNumber(int num) {
        StringBuffer encodeString = new StringBuffer();
        while (num >= 0x20) {
                int nextValue = (0x20 | (num & 0x1f)) + 63;
                encodeString.append((char)(nextValue));
            num >>= 5;
        }
        num += 63;
        encodeString.append((char)(num));
        return encodeString;
    }
    
    /**
     * Encode a polyline with Google polyline encoding method
     * @param list the polyline
     * @param precision 1 for a 6 digits encoding, 10 for a 5 digits encoding. 
     * @return the encoded polyline, as a String
     */
    public static String encode(List<PointBean> list) {
                StringBuffer encodedPoints = new StringBuffer();
                int prev_lat = 0, prev_lng = 0;
                for (PointBean trackpoint:list) {
                        int lat = (int)(trackpoint.getLat()*1E5);
                        int lng = (int)(trackpoint.getLng()*1E5);
                        encodedPoints.append(encodeSignedNumber(lat - prev_lat));
                        encodedPoints.append(encodeSignedNumber(lng - prev_lng));                       
                        prev_lat = lat;
                        prev_lng = lng;
                }
                return encodedPoints.toString();
        }

    /**
     * Decode a polyline encoded with Google polyline encoding method
     * @param encoded a polyline
     * @return decoded array of coordinates
     */
    public static List<double[]> decode(String encoded) {

    	List<double[]> poly = new ArrayList<double[]>();
    	int index = 0, len = encoded.length();
    	int lat = 0, lng = 0;

    	while (index < len) {
    		int b, shift = 0, result = 0;
    		do {
    			b = encoded.charAt(index++) - 63;
    			result |= (b & 0x1f) << shift;
    			shift += 5;
    		} while (b >= 0x20);
    		int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    		lat += dlat;

    		shift = 0;
    		result = 0;
    		do {
    			b = encoded.charAt(index++) - 63;
    			result |= (b & 0x1f) << shift;
    			shift += 5;
    		} while (b >= 0x20);
    		int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    		lng += dlng;
    		poly.add(new double[]{lat/1E5, lng/1E5});
    	}

    	return poly;
    }

}